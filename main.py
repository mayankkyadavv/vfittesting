import subprocess
import os
import json  # Assuming you might want to pass some JSON-like data

def run_blender_script(data, username):
    # Define paths
    blender_executable_path = '/Applications/Blender.app/Contents/MacOS/Blender'
    script_path = "blender.py"  # Adjusted for simplicity
    output_directory = "/Users/mayankyadav/Desktop/software/blenderTest/output"  

    # Construct command with arguments
    command = [
        blender_executable_path,
        '--background',  # Uncomment to run Blender in background without UI
        '--python', script_path,
        '--',  # Separator between Blender args and script args
        str(data.get('age', '')),
        str(data.get('height', '')),
        str(data.get('muscularity', '')),
        str(data.get('skinny', '')),
        str(data.get('overweight', '')),
        str(data.get('skinColor', '')),
        str(username),
        str(output_directory)
    ]

    try:
        # Execute the Blender script and capture output
        result = subprocess.run(command, check=True, capture_output=True, text=True)
        output = result.stdout
        print("Script executed successfully!")
        print("Output:", output)
        # Handle success, e.g., updating database or returning a response in an API context
    except subprocess.CalledProcessError as e:
        error_output = e.stderr
        print("Error executing script:", error_output)
        # Handle errors, e.g., logging or returning an error response in an API context

if __name__ == "__main__":
    # Example data, replace with actual data as needed
    data = {
        'age': '25',
        'height': '180',
        'muscularity': '5',
        'skinny': '5',
        'overweight': '5',
        'skinColor': '#fff'
    }
    username = 'JohnDoe'  # Example username, replace as needed
    run_blender_script(data, username)

