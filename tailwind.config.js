/** @type {import('tailwindcss').Config} */
/* :root {
  --header-height: 60px;
  --color-primary: #eb7f00;
  --color-menu-background: #fff6eb;
  --color-menu-background-stronger: #ffefdc;
  --color-sub-primary: #4461c8;
  --color-sub-primary-light: #d7e0ff;
  --color-secondary: #999999;
  --color-green: #4fcb4c;
  --color-button-red: #c84444;
  --color-button-yellow: #fbff31;
  --color-brown: #53432b;
  --shadow-color: rgba(0, 0, 0, 0.2);
  --modal-shadow-color: rgba(0, 0, 0, 0.6);
  --button-border-color: #e0e0e0;
  --menu-text-color: var(--color-brown);
  --drawer-width: 60vw;
  --drawer-min-width: 200px;
  --drawer-max-width: 350px;
  --drawer-transition: ease-in-out 0.3s;
  --modal-transition: ease-in-out 0.3s;
}
*/
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#eb7f00",
        green: "#4fcb4c",
        secondary: "#999999",
        subPrimary: "#4461c8",
        subPrimaryLight: "#d7e0ff",
        buttonRed: "#c84444",
        buttonYellow: "#fbff31",
        brown: "#53432b",
        menuBackground: "#fff6eb",
        menuBackgroundStronger: "#ffefdc",
        menuTextColor: "#53432b",
        gray: "gray",
        white: "white",
      },
    },
  },
  plugins: [],
};
