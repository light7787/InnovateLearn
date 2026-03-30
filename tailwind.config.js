/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'river-blue': {
          6: '#00405d',
          5: '#007db6',
          4: '#61afd2',
          3: '#c4e1ee',
          2: '#deeef6',
          1: '#f7fbfd',
        },
        'river-red': {
          6: '#4c2522',
          5: '#934842',
          4: '#f3776c',
          3: '#fbcdc8',
          2: '#fde3e0',
          1: '#fef8f7',
        },
        'river-yellow': {
          6: '#373409',
          5: '#6a6612',
          4: '#b0a81f',
          3: '#f7ec2b',
          2: '#fbf486',
          1: '#fefce1',
        },
      },
    },
  },
  plugins: [],
};
