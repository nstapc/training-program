/**
 * Workout data optimized for HOME GYM equipment
 * Based on Brad Schoenfeld's hypertrophy research and modern bodybuilding science
 * 
 * EQUIPMENT AVAILABLE:
 * - Dumbbells (adjustable)
 * - Ironmaster Bench (incline/decline capable)
 *   - Leg extension/curl attachment
 *   - Preacher curl attachment
 *   - Pull-up attachment
 * - Gymnastic Rings
 * - Resistance Bands
 * - Bullworker
 * - Power Twisters
 * - Hand Gripper
 * - Lattice Lifting Pin
 * - Wooden Minibar
 */

export const workouts = {
  workoutA: {
    name: 'Workout A',
    description: 'Push (Chest/Shoulders/Triceps) - Heavy Focus',
    exercises: [
      {
        name: 'DB Bench Press',
        sets: 4,
        reps: '6-8',
        rest: 150,
        group: 'A',
        notes: 'Greater ROM than barbell, superior pec stretch. Control the descent.',
        equipment: 'Dumbbells + Bench'
      },
      {
        name: 'DB Overhead Press (Seated)',
        sets: 3,
        reps: '8-10',
        rest: 120,
        group: 'B',
        notes: 'Neutral or pronated grip. Full lockout overhead.',
        equipment: 'Dumbbells + Bench'
      },
      {
        name: 'Incline DB Press',
        sets: 3,
        reps: '8-10',
        rest: 120,
        group: 'C',
        notes: '30-45° incline. Targets upper chest. Lengthened position emphasis.',
        equipment: 'Dumbbells + Bench'
      },
      {
        name: 'Ring Dips',
        sets: 3,
        reps: '8-12',
        rest: 90,
        group: 'D',
        notes: 'Lean forward for chest emphasis. Rings turned out at top. Superior to machine dips.',
        equipment: 'Rings'
      },
      {
        name: 'DB Lateral Raises',
        sets: 3,
        reps: '12-15',
        rest: 60,
        group: 'E1',
        notes: 'Slight forward lean. Raise to shoulder height. Control eccentric.',
        equipment: 'Dumbbells'
      },
      {
        name: 'Band Face Pulls',
        sets: 3,
        reps: '15-20',
        rest: 0,
        group: 'E2',
        notes: 'External rotation at end. Critical for shoulder health. Superset with laterals.',
        equipment: 'Bands'
      },
      {
        name: 'DB Overhead Triceps Extension',
        sets: 3,
        reps: '10-12',
        rest: 90,
        group: 'F',
        notes: 'Long head emphasis due to shoulder flexion. Deep stretch at bottom.',
        equipment: 'Dumbbells'
      },
      {
        name: 'Ring Push-ups (Diamond)',
        sets: 2,
        reps: '12-15',
        rest: 60,
        group: 'G',
        notes: 'Triceps finisher. Rings increase instability and muscle activation.',
        equipment: 'Rings'
      },
    ]
  },

  workoutB: {
    name: 'Workout B',
    description: 'Pull (Back/Biceps/Rear Delts) - Volume Focus',
    exercises: [
      {
        name: 'Pull-ups (Various Grips)',
        sets: 4,
        reps: '6-10',
        rest: 150,
        group: 'A',
        notes: 'Rotate grips: wide, neutral, chin-up. Superior to lat pulldown per EMG studies.',
        equipment: 'Pull-up Attachment'
      },
      {
        name: 'DB Row (Chest Supported)',
        sets: 3,
        reps: '8-10',
        rest: 120,
        group: 'B',
        notes: 'Incline bench support removes momentum. Full stretch at bottom.',
        equipment: 'Dumbbells + Bench'
      },
      {
        name: 'Ring Rows',
        sets: 3,
        reps: '10-12',
        rest: 90,
        group: 'C',
        notes: 'Adjust difficulty by foot position. Squeeze scapula at top.',
        equipment: 'Rings'
      },
      {
        name: 'Ring Face Pulls',
        sets: 3,
        reps: '15-20',
        rest: 60,
        group: 'D1',
        notes: 'External rotation at end. Rear delt and rotator cuff emphasis.',
        equipment: 'Rings'
      },
      {
        name: 'DB Rear Delt Fly (Incline)',
        sets: 3,
        reps: '12-15',
        rest: 0,
        group: 'D2',
        notes: 'Chest on incline bench. Eliminates momentum. Superset with face pulls.',
        equipment: 'Dumbbells + Bench'
      },
      {
        name: 'DB Curl (Standing)',
        sets: 3,
        reps: '8-10',
        rest: 90,
        group: 'E',
        notes: 'Supinate at top. No swinging. Control the negative.',
        equipment: 'Dumbbells'
      },
      {
        name: 'DB Hammer Curl',
        sets: 3,
        reps: '10-12',
        rest: 60,
        group: 'F',
        notes: 'Brachialis and brachioradialis emphasis. Neutral grip throughout.',
        equipment: 'Dumbbells'
      },
      {
        name: 'Grip Work - Hand Gripper',
        sets: 3,
        reps: '10-15',
        rest: 60,
        group: 'G',
        notes: 'Crush grip strength. Hold at close for 2-3 seconds.',
        equipment: 'Hand Gripper'
      },
    ]
  },

  workoutC: {
    name: 'Workout C',
    description: 'Legs (Quads/Hamstrings/Glutes) - Compound Focus',
    exercises: [
      {
        name: 'DB Goblet Squat',
        sets: 4,
        reps: '8-10',
        rest: 150,
        group: 'A',
        notes: 'Heels elevated if needed. Deep ROM. Quad dominant.',
        equipment: 'Dumbbells'
      },
      {
        name: 'DB Romanian Deadlift',
        sets: 4,
        reps: '8-10',
        rest: 120,
        group: 'B',
        notes: 'Hinge at hips. Feel hamstring stretch. Critical for posterior chain.',
        equipment: 'Dumbbells'
      },
      {
        name: 'Bulgarian Split Squat',
        sets: 3,
        reps: '10-12 each',
        rest: 90,
        group: 'C',
        notes: 'Rear foot on bench. Excellent unilateral quad/glute builder.',
        equipment: 'Dumbbells + Bench'
      },
      {
        name: 'Leg Extension (Attachment)',
        sets: 3,
        reps: '12-15',
        rest: 60,
        group: 'D1',
        notes: 'Rectus femoris isolation. Pause at top contraction.',
        equipment: 'Bench Leg Attachment'
      },
      {
        name: 'Leg Curl (Attachment)',
        sets: 3,
        reps: '12-15',
        rest: 0,
        group: 'D2',
        notes: 'Hamstring isolation. Superset with extensions. Control eccentric.',
        equipment: 'Bench Leg Attachment'
      },
      {
        name: 'DB Calf Raise (Single Leg)',
        sets: 4,
        reps: '15-20',
        rest: 60,
        group: 'E',
        notes: 'Full stretch at bottom, full contraction at top. One leg at a time.',
        equipment: 'Dumbbells'
      },
      {
        name: 'Plank',
        sets: 3,
        reps: '45-60s',
        rest: 60,
        group: 'F',
        notes: 'Core stability. Posterior pelvic tilt. Squeeze glutes.',
        equipment: 'Bodyweight'
      },
    ]
  },

  workoutD: {
    name: 'Workout D',
    description: 'Push Variation (Chest/Shoulders/Triceps) - Hypertrophy Focus',
    exercises: [
      {
        name: 'Incline DB Fly',
        sets: 4,
        reps: '10-12',
        rest: 90,
        group: 'A',
        notes: 'Deep stretch at bottom - lengthened partials for hypertrophy. Schoenfeld 2023 research.',
        equipment: 'Dumbbells + Bench'
      },
      {
        name: 'Ring Push-ups',
        sets: 4,
        reps: '10-15',
        rest: 90,
        group: 'B',
        notes: 'Turn rings out at top. Instability increases pec and core activation.',
        equipment: 'Rings'
      },
      {
        name: 'DB Arnold Press',
        sets: 3,
        reps: '10-12',
        rest: 90,
        group: 'C',
        notes: 'Rotation through movement. Hits all delt heads.',
        equipment: 'Dumbbells + Bench'
      },
      {
        name: 'Band Lateral Raises',
        sets: 3,
        reps: '15-20',
        rest: 60,
        group: 'D1',
        notes: 'Constant tension throughout ROM. Different resistance curve than DBs.',
        equipment: 'Bands'
      },
      {
        name: 'DB Front Raise',
        sets: 3,
        reps: '12-15',
        rest: 0,
        group: 'D2',
        notes: 'Anterior delt. Alternate arms or together. Superset with laterals.',
        equipment: 'Dumbbells'
      },
      {
        name: 'Ring Flyes',
        sets: 3,
        reps: '8-12',
        rest: 90,
        group: 'E',
        notes: 'Excellent stretch-mediated hypertrophy. Start with feet forward to reduce difficulty.',
        equipment: 'Rings'
      },
      {
        name: 'DB Skull Crusher',
        sets: 3,
        reps: '10-12',
        rest: 60,
        group: 'F',
        notes: 'Lower to forehead/behind head. Long head emphasis.',
        equipment: 'Dumbbells + Bench'
      },
      {
        name: 'Power Twister - Chest Squeeze',
        sets: 2,
        reps: '12-15',
        rest: 60,
        group: 'G',
        notes: 'Isometric/concentric chest work. Hold at peak contraction.',
        equipment: 'Power Twister'
      },
    ]
  },

  workoutE: {
    name: 'Workout E',
    description: 'Pull Variation (Back/Biceps/Rear Delts) - Metabolic Focus',
    exercises: [
      {
        name: 'Chin-ups (Close Grip)',
        sets: 4,
        reps: '6-10',
        rest: 120,
        group: 'A',
        notes: 'Supinated grip. More bicep involvement. Full dead hang at bottom.',
        equipment: 'Pull-up Attachment'
      },
      {
        name: 'Single-Arm DB Row',
        sets: 3,
        reps: '10-12 each',
        rest: 90,
        group: 'B',
        notes: 'One hand on bench. Full lat stretch at bottom, squeeze at top.',
        equipment: 'Dumbbells + Bench'
      },
      {
        name: 'Ring Face Pulls to External Rotation',
        sets: 3,
        reps: '15-20',
        rest: 60,
        group: 'C',
        notes: 'Pull to face, rotate hands back. Superior to cable face pulls.',
        equipment: 'Rings'
      },
      {
        name: 'Band Pull-Aparts',
        sets: 3,
        reps: '15-20',
        rest: 60,
        group: 'D',
        notes: 'Rear delts and mid traps. Keep arms straight.',
        equipment: 'Bands'
      },
      {
        name: 'DB Preacher Curl',
        sets: 3,
        reps: '10-12',
        rest: 90,
        group: 'E',
        notes: 'Eliminates cheating. Excellent for short head biceps. Full stretch at bottom.',
        equipment: 'Dumbbells + Preacher Attachment'
      },
      {
        name: 'Incline DB Curl',
        sets: 3,
        reps: '10-12',
        rest: 60,
        group: 'F',
        notes: 'Long head emphasis - stretched position. Key for bicep peak.',
        equipment: 'Dumbbells + Bench'
      },
      {
        name: 'DB Reverse Curl',
        sets: 2,
        reps: '12-15',
        rest: 60,
        group: 'G',
        notes: 'Brachioradialis and forearm extensors. Overhand grip.',
        equipment: 'Dumbbells'
      },
      {
        name: 'Lattice Pin Hangs',
        sets: 2,
        reps: '20-30s',
        rest: 60,
        group: 'H',
        notes: 'Finger and grip strength. Dead hang position.',
        equipment: 'Lattice Pin'
      },
    ]
  },

  workoutF: {
    name: 'Workout F',
    description: 'Legs Variation (Posterior Chain/Glutes) - Unilateral Focus',
    exercises: [
      {
        name: 'DB Single-Leg Romanian Deadlift',
        sets: 4,
        reps: '8-10 each',
        rest: 90,
        group: 'A',
        notes: 'Balance and hamstring stretch. Hold DB on opposite side.',
        equipment: 'Dumbbells'
      },
      {
        name: 'Reverse Lunge',
        sets: 3,
        reps: '10-12 each',
        rest: 90,
        group: 'B',
        notes: 'Step back, not forward. More glute/hamstring emphasis than forward lunge.',
        equipment: 'Dumbbells'
      },
      {
        name: 'DB Hip Thrust (Bench)',
        sets: 3,
        reps: '12-15',
        rest: 90,
        group: 'C',
        notes: 'Upper back on bench. Pause at top. Best exercise for glute activation.',
        equipment: 'Dumbbells + Bench'
      },
      {
        name: 'Leg Curl (Attachment)',
        sets: 4,
        reps: '10-12',
        rest: 60,
        group: 'D',
        notes: 'Hamstring isolation. Slow eccentric (3-4 seconds).',
        equipment: 'Bench Leg Attachment'
      },
      {
        name: 'DB Step-ups',
        sets: 3,
        reps: '12-15 each',
        rest: 60,
        group: 'E',
        notes: 'Bench height. Push through lead leg only, no push-off from back foot.',
        equipment: 'Dumbbells + Bench'
      },
      {
        name: 'DB Seated Calf Raise',
        sets: 4,
        reps: '15-20',
        rest: 60,
        group: 'F',
        notes: 'DB on knees. Targets soleus. Pause at stretch and contraction.',
        equipment: 'Dumbbells'
      },
      {
        name: 'Hanging Leg Raise',
        sets: 3,
        reps: '10-15',
        rest: 60,
        group: 'G',
        notes: 'Core and hip flexors. Control the swing. Bent knee to make easier.',
        equipment: 'Pull-up Attachment'
      },
      {
        name: 'Bullworker Isometric Squeeze',
        sets: 2,
        reps: '3x10s holds',
        rest: 60,
        group: 'H',
        notes: 'Full body tension. Choose compression or extension movement.',
        equipment: 'Bullworker'
      },
    ]
  },

  workoutCatchup: {
    name: 'Catch-up Workout',
    description: 'Full Body - All Muscle Groups Stimulation',
    exercises: [
      {
        name: 'DB Goblet Squat',
        sets: 4,
        reps: '8-10',
        rest: 120,
        group: 'A',
        notes: 'Compound quad/glute exercise. Deep ROM for maximum stimulus.',
        equipment: 'Dumbbells'
      },
      {
        name: 'DB Bench Press',
        sets: 4,
        reps: '6-8',
        rest: 120,
        group: 'B',
        notes: 'Heavy chest/shoulder/tricep compound. Greater stretch than barbell.',
        equipment: 'Dumbbells + Bench'
      },
      {
        name: 'Pull-ups (Neutral Grip)',
        sets: 4,
        reps: '6-10',
        rest: 120,
        group: 'C',
        notes: 'Back/bicep compound. Neutral grip reduces shoulder stress.',
        equipment: 'Pull-up Attachment'
      },
      {
        name: 'DB Overhead Press (Standing)',
        sets: 3,
        reps: '8-10',
        rest: 90,
        group: 'D',
        notes: 'Shoulder/tricep compound. Standing engages core.',
        equipment: 'Dumbbells'
      },
      {
        name: 'DB Romanian Deadlift',
        sets: 3,
        reps: '8-10',
        rest: 90,
        group: 'E',
        notes: 'Posterior chain compound. Hamstring/glute/back emphasis.',
        equipment: 'Dumbbells'
      },
      {
        name: 'Ring Dips',
        sets: 3,
        reps: '8-12',
        rest: 90,
        group: 'F',
        notes: 'Chest/tricep/shoulder compound. Rings add instability.',
        equipment: 'Rings'
      },
      {
        name: 'Single-Arm DB Row',
        sets: 3,
        reps: '10-12 each',
        rest: 90,
        group: 'G',
        notes: 'Back/bicep compound. Unilateral for symmetry.',
        equipment: 'Dumbbells + Bench'
      },
      {
        name: 'DB Hammer Curl',
        sets: 3,
        reps: '10-12',
        rest: 60,
        group: 'H1',
        notes: 'Bicep/brachialis compound. Neutral grip.',
        equipment: 'Dumbbells'
      },
      {
        name: 'DB Overhead Triceps Extension',
        sets: 3,
        reps: '10-12',
        rest: 0,
        group: 'H2',
        notes: 'Tricep compound. Long head emphasis. Superset with curls.',
        equipment: 'Dumbbells'
      },
      {
        name: 'DB Lateral Raises',
        sets: 3,
        reps: '12-15',
        rest: 60,
        group: 'I',
        notes: 'Shoulder isolation. Control eccentric.',
        equipment: 'Dumbbells'
      },
      {
        name: 'Band Face Pulls',
        sets: 3,
        reps: '15-20',
        rest: 60,
        group: 'J',
        notes: 'Rear delt/rotator cuff. Critical for shoulder health.',
        equipment: 'Bands'
      },
      {
        name: 'DB Calf Raise (Single Leg)',
        sets: 4,
        reps: '15-20',
        rest: 60,
        group: 'K',
        notes: 'Calf isolation. Unilateral for balance.',
        equipment: 'Dumbbells'
      },
      {
        name: 'Plank',
        sets: 3,
        reps: '60s',
        rest: 60,
        group: 'L',
        notes: 'Core stability. Full body tension.',
        equipment: 'Bodyweight'
      }
    ]
  }
};

/**
 * Equipment Reference Guide
 * Maps exercises to required equipment for filtering/planning
 */
export const equipmentGuide = {
  dumbbells: [
    'DB Bench Press', 'DB Overhead Press', 'Incline DB Press', 'DB Lateral Raises',
    'DB Overhead Triceps Extension', 'DB Row', 'DB Curl', 'DB Hammer Curl',
    'DB Goblet Squat', 'DB Romanian Deadlift', 'DB Calf Raise', 'DB Arnold Press',
    'DB Front Raise', 'DB Skull Crusher', 'Single-Arm DB Row', 'DB Preacher Curl',
    'Incline DB Curl', 'DB Reverse Curl', 'DB Single-Leg Romanian Deadlift',
    'Reverse Lunge', 'DB Hip Thrust', 'DB Step-ups', 'DB Seated Calf Raise',
    'Incline DB Fly', 'DB Rear Delt Fly'
  ],
  bench: [
    'DB Bench Press', 'Incline DB Press', 'DB Row (Chest Supported)',
    'Bulgarian Split Squat', 'DB Arnold Press', 'DB Skull Crusher',
    'Single-Arm DB Row', 'DB Hip Thrust', 'DB Step-ups', 'Incline DB Fly',
    'DB Rear Delt Fly', 'DB Overhead Press (Seated)', 'Incline DB Curl'
  ],
  legAttachment: [
    'Leg Extension', 'Leg Curl'
  ],
  preacherAttachment: [
    'DB Preacher Curl'
  ],
  pullupAttachment: [
    'Pull-ups', 'Chin-ups', 'Hanging Leg Raise'
  ],
  rings: [
    'Ring Dips', 'Ring Push-ups', 'Ring Rows', 'Ring Face Pulls',
    'Ring Flyes', 'Ring Push-ups (Diamond)'
  ],
  bands: [
    'Band Face Pulls', 'Band Lateral Raises', 'Band Pull-Aparts'
  ],
  bullworker: [
    'Bullworker Isometric Squeeze'
  ],
  powerTwister: [
    'Power Twister - Chest Squeeze'
  ],
  handGripper: [
    'Grip Work - Hand Gripper'
  ],
  latticePin: [
    'Lattice Pin Hangs'
  ],
  bodyweight: [
    'Plank', 'Pull-ups', 'Chin-ups', 'Hanging Leg Raise'
  ]
};

/**
 * Weekly Volume Calculation (Home Gym Adapted)
 * Based on Schoenfeld et al. (2017) optimal ranges
 */
export const weeklyVolume = {
  chest: {
    exercises: ['DB Bench Press', 'Incline DB Press', 'Ring Dips', 'Incline DB Fly', 'Ring Push-ups', 'Ring Flyes', 'Power Twister'],
    setsPerWeek: 16, // 4+3+3+4+4 = 18 (within 10-20 optimal range)
    target: { min: 10, optimal: 14, max: 20 }
  },
  back: {
    exercises: ['Pull-ups', 'DB Row', 'Ring Rows', 'Chin-ups', 'Single-Arm DB Row'],
    setsPerWeek: 17, // 4+3+3+4+3 = 17 (within 12-20 optimal range)
    target: { min: 12, optimal: 16, max: 20 }
  },
  shoulders: {
    exercises: ['DB Overhead Press', 'DB Lateral Raises', 'Band Face Pulls', 'DB Arnold Press', 'Band Lateral Raises', 'DB Front Raise'],
    setsPerWeek: 14, // 3+3+3+3+3+2 = 17 includes rear delts
    target: { min: 8, optimal: 12, max: 16 }
  },
  biceps: {
    exercises: ['DB Curl', 'DB Hammer Curl', 'DB Preacher Curl', 'Incline DB Curl', 'DB Reverse Curl'],
    setsPerWeek: 14, // 3+3+3+3+2 = 14 (within 6-14 optimal range)
    target: { min: 6, optimal: 10, max: 14 }
  },
  triceps: {
    exercises: ['Ring Dips', 'DB Overhead Triceps Extension', 'Ring Push-ups (Diamond)', 'DB Skull Crusher'],
    setsPerWeek: 11, // 3+3+2+3 = 11 (within 6-14 optimal range)
    target: { min: 6, optimal: 10, max: 14 }
  },
  quads: {
    exercises: ['DB Goblet Squat', 'Bulgarian Split Squat', 'Leg Extension', 'Reverse Lunge', 'DB Step-ups'],
    setsPerWeek: 16, // 4+3+3+3+3 = 16 (within 12-20 optimal range)
    target: { min: 12, optimal: 16, max: 20 }
  },
  hamstrings: {
    exercises: ['DB Romanian Deadlift', 'Leg Curl', 'DB Single-Leg Romanian Deadlift'],
    setsPerWeek: 15, // 4+6+4 = 14 (within 10-18 optimal range)
    target: { min: 10, optimal: 14, max: 18 }
  },
  glutes: {
    exercises: ['Bulgarian Split Squat', 'DB Hip Thrust', 'Reverse Lunge', 'DB Step-ups', 'DB Single-Leg Romanian Deadlift'],
    setsPerWeek: 16, // Overlaps with quads/hams
    target: { min: 10, optimal: 14, max: 18 }
  },
  calves: {
    exercises: ['DB Calf Raise (Single Leg)', 'DB Seated Calf Raise'],
    setsPerWeek: 8, // 4+4 = 8 (within 12-20, could increase)
    target: { min: 12, optimal: 16, max: 20 }
  }
};
