from flask import Flask, Response, jsonify, make_response
from flask_cors import CORS
import cv2
import mediapipe as mp
import numpy as np
import time
from dataclasses import dataclass
import json
import base64

app = Flask(__name__)

# Configure CORS properly
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    }
})
@dataclass
class GameState:
    points: int = 0
    pipes: list = None
    game_over: bool = False
    height: int = 480
    width: int = 640
    
    def __post_init__(self):
        self.pipes = []

class GameConstants:
    GAP = 130
    SPEED = 16
    PIPE_WIDTH = 60
    GEN_TIME = 1.2

class GameController:
    def __init__(self):
        self.cap = cv2.VideoCapture(0)
        self.hand = mp.solutions.hands
        self.hand_model = self.hand.Hands(max_num_hands=1)
        self.game_state = GameState()
        self.last_pipe_time = time.time()
        
    def create_pipe(self):
        rand_y_top = np.random.randint(0, self.game_state.height - GameConstants.GAP)
        self.game_state.pipes.append({
            'x': self.game_state.width,
            'y_top': rand_y_top,
            'y_bottom': rand_y_top + GameConstants.GAP,
            'passed': False
        })
    
    def update_pipes(self):
        for pipe in self.game_state.pipes[:]:
            pipe['x'] -= GameConstants.SPEED
            if pipe['x'] <= 0:
                self.game_state.pipes.remove(pipe)
    
    def check_collision(self, index_pt):
        for pipe in self.game_state.pipes:
            if (index_pt[0] >= pipe['x'] and 
                index_pt[0] <= pipe['x'] + GameConstants.PIPE_WIDTH):
                if (index_pt[1] <= pipe['y_top'] or 
                    index_pt[1] >= pipe['y_bottom']):
                    return True
                elif not pipe['passed']:
                    pipe['passed'] = True
                    self.game_state.points += 1
                    if self.game_state.points % 10 == 0:
                        GameConstants.SPEED += 4
                        GameConstants.GEN_TIME -= 0.2
        return False

    def process_frame(self):
        success, frame = self.cap.read()
        if not success:
            return None
        
        frame = cv2.flip(frame, 1)
        
        # Process hand landmarks
        frame.flags.writeable = False
        results = self.hand_model.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        frame.flags.writeable = True
        
        # Generate new pipe if needed
        current_time = time.time()
        if current_time - self.last_pipe_time >= GameConstants.GEN_TIME:
            self.create_pipe()
            self.last_pipe_time = current_time
        
        # Update pipe positions
        self.update_pipes()
        
        hand_position = None
        if results.multi_hand_landmarks:
            landmarks = results.multi_hand_landmarks[0].landmark
            index_finger = landmarks[8]
            hand_position = {
                'x': int(index_finger.x * self.game_state.width),
                'y': int(index_finger.y * self.game_state.height)
            }
            
            # Check collision
            if self.check_collision((hand_position['x'], hand_position['y'])):
                self.game_state.game_over = True

        # Convert frame to base64 for sending to frontend
        _, buffer = cv2.imencode('.jpg', frame)
        frame_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return {
            'hand_position': hand_position,
            'game_state': {
                'points': self.game_state.points,
                'pipes': self.game_state.pipes,
                'game_over': self.game_state.game_over
            },
            'frame': frame_base64
        }

game_controller = GameController()
@app.route('/game-state')
def get_game_state():
    state = game_controller.process_frame()
    if state is None:
        response = jsonify({'error': 'Failed to capture frame'})
        response.status_code = 500
    else:
        response = jsonify(state)
    
    # Explicitly set CORS headers
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    return response

@app.route('/reset-game')
def reset_game():
    game_controller.game_state = GameState()
    game_controller.last_pipe_time = time.time()
    GameConstants.SPEED = 16
    GameConstants.GEN_TIME = 1.2
    
    response = jsonify({'status': 'success'})
    # Explicitly set CORS headers
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    return response

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    return response

if __name__ == '__main__':
    app.run(debug=True, port=5000)