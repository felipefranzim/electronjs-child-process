import { createTheme } from '@mui/material/styles';
import "@mui/material";

declare module '@mui/material/styles' {
  interface PaletteOptions {
    redValid?: {
      light?: string;
      main?: string;
      dark?: string;
    },
    successValid?: {
      light?: string;
      main?: string;
      dark?: string;
    };
  }

  interface Palette {
    redValid: {
      light?: string;
      main?: string;
      dark?: string;
    },
    successValid?: {
      light?: string;
      main?: string;
      dark?: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#000',
      // light: '#636363',
      // main: '#222222',
      // dark: '#000000',
      // fontFamily: 'Poppins'
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#FFF'
    },
    // Provide every color token (light, main, dark, and contrastText) when using
    // custom colors for props in Material UI's components.
    // Then you will be able to use it like this: `<Button color="custom">`
    // (For TypeScript, you need to add module augmentation for the `custom` value)
    redValid: {
      main: '#FF4841',
    },
    successValid: {
      main: '#255A04',
      dark: '#255A04'
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
  // components: {
  //     MuiButton: {
  //         styleOverrides: {
  //             root: {
  //                 variants: [
  //                     {
  //                         props: { color: 'redValid' },
  //                         style: {
  //                             "&:hover": {
  //                                 backgroundColor: "#d73a34",
  //                             }
  //                         },
  //                     },
  //                 ],
  //             },
  //         },
  //     }
  // }
});
