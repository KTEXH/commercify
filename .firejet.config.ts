import { FJ } from "@firejet/cli";

const config: FJ.FireJetConfig = {
  groups: {
    default: {
      components: {
        LandingPage: {
          defaultExport: true,
          path: "src/components/LandingPage.jsx",
          exportName: "LandingPage",
          structure: {
            type: "component",
            name: "LandingPage",
            children: [],
            props: {},
          },
        },
        TT: {
          defaultExport: true,
          path: "src/components/TT.jsx",
          exportName: "TT",
          structure: {
            type: "component",
            name: "TT",
            children: [],
            props: {},
          },
        },
        TVector: {
          defaultExport: true,
          path: "src/components/TVector.jsx",
          exportName: "TVector",
          structure: {
            type: "component",
            name: "TVector",
            children: [],
            props: {},
          },
        },
        Component: {
          defaultExport: true,
          path: "src/components/Component.jsx",
          exportName: "Component",
          structure: {
            type: "component",
            name: "Component",
            children: [],
            props: {},
          },
        },
      },
      globalCss: ["./styles.css"],
      postcssPath: "./postcss.config.js",
    },
  },
};

export default config;
