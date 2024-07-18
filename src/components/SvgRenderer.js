import React from "react";
import { SvgXml } from "react-native-svg";

const SvgRenderer = ({ svgString }) => {
  const xml = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 392.72727272727275 703.2727272727273">
      ${svgString}
    </svg>
  `;

  return <SvgXml xml={xml} width="100%" height="100%" />;
};

export default SvgRenderer;
