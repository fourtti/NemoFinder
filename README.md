# NemoFinder
repository for school project
 
 Drone Simulation
 - onscreen 'Map' and 'Back' buttons are disabled, reload the web player on page change, losing all progress.
 
 Controls
 - movement: 'WASD', Arrow keys and onscreen arrows on left side. Direction is relative to camera facing.
   Movement is flattened to a plane to maintain the sonar unit at the water surface level.
 - camera: rotating the view is done by 'Z'/'X' for left/right & 'C'/'V' for up/down or onscreen arrow controls at the right side.
 - sonar can be activated & deactivated (toggled) by mid-bottom screen button
 -  Numpad '+'/'-' go up/down. Please note that the sonar is a sphere centered on the prop, so changing elevation can impair fish detection
 - 'I'/'Y' add fish to the lake 'one per press'/'continously while held'.
 - 'M'/'N' add navigation markers into the world, 'in a single specific spot'/'in a random spot'.
 - 'P'/'R' test the 'Patrol area'/'follow Route' autopilots. Route is a double loop of the default markers. Patrol is bound in a square of 
    max/min coordinates derived from those same markers.
 - 'Q' and onscreen '(X)' terminate autopilot (route/area)
 
 Note that using browser 'back' functionality to leave the drone screen can reset the unity player.
