const gravitation_pull = 10

function get_y_displacement(launch, time_elapsed) {
    const straight_displacement = launch.velocity * time_elapsed * Math.sin(launch.angle) // 30
    const gravitation_effect = 0.5 * gravitation_pull * time_elapsed * time_elapsed // 20
    return straight_displacement - gravitation_effect // 10
}

function is_still_midair(launch, time_elapsed) {
    return get_y_displacement(launch, time_elapsed) > 0
}

const launch_info = {
    velocity: 30,
    angle: Math.PI / 6
}

console.log(get_y_displacement(launch_info, 2)) // 10
console.log(is_still_midair(launch_info, 2)) // true
