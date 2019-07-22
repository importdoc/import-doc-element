/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface ImportDoc {
    'src': string;
  }
}

declare global {


  interface HTMLImportDocElement extends Components.ImportDoc, HTMLStencilElement {}
  var HTMLImportDocElement: {
    prototype: HTMLImportDocElement;
    new (): HTMLImportDocElement;
  };
  interface HTMLElementTagNameMap {
    'import-doc': HTMLImportDocElement;
  }
}

declare namespace LocalJSX {
  interface ImportDoc extends JSXBase.HTMLAttributes<HTMLImportDocElement> {
    'src'?: string;
  }

  interface IntrinsicElements {
    'import-doc': ImportDoc;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}


