import React from "react";

export const repeat = (n: number, component: any) => {
  return Array.from({ length: n }, (_, i) =>
    React.cloneElement(component, { key: i })
  );
};

export default repeat;
