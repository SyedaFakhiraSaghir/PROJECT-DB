document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/workouts')
        .then(res => res.json())
        .then(data => {
            const lastWorkout = data[data.length - 1];
            document.getElementById('workout-data').innerHTML = `
                <p>Date: ${new Date(lastWorkout.date).toLocaleDateString()}</p>
                <p>Total Duration: ${lastWorkout.duration || 'N/A'}</p>
                <p>Exercises: ${lastWorkout.exercisesPerformed}</p>
                <p>Weight Lifted: ${lastWorkout.totalWeightLifted} lbs</p>
                <p>Sets: ${lastWorkout.totalSets}</p>
                <p>Reps: ${lastWorkout.totalReps}</p>
            `;
        })
        .catch(err => console.error('Error loading workouts:', err));
});

document.getElementById('new-workout').addEventListener('click', () => {
    window.location.href = '/new-workout';
});
