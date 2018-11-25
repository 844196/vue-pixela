declare module 'unist' {
  export = Unist;

  namespace Unist {
    interface Node {
      type: string;
      data?: Data;
      position?: Position;
    }

    interface Data {
      [key: string]: string | number | object | any[] | boolean | null;
    }

    interface Position {
      start: Point;
      end: Point;
      indent?: number[];
    }

    interface Point {
      line: number;
      column: number;
      offset?: number;
    }

    interface Parent<T extends Node = Node> extends Node {
      children: T[];
    }

    interface Text extends Node {
      value: string;
    }
  }
}

declare module 'hast' {
  import { Parent, Node, Text } from 'unist';

  export = HAST;

  namespace HAST {
    interface Root extends Parent<Element | TextNode> {
      type: 'root';
    }

    interface ElementProperties {
      className?: string[];
      htmlFor?: string;
      [key: string]: any;
    }

    interface Element extends Parent<Element | TextNode> {
      type: 'element';
      tagName: string;
      properties: ElementProperties;
      content?: Root;
    }

    interface Doctype extends Node {
      type: 'doctype';
      name: string;
      public: string | null;
      system: string | null;
    }

    interface Comment extends Text {
      type: 'comment';
    }

    interface TextNode extends Text {
      type: 'text';
    }
  }
}

declare module 'unified' {
  import { Node } from 'unist';

  const unified: () => Unified;
  export default unified;

  export interface Unified {
    use(plugin: any): this;
    use<T>(plugin: any, options: T): this;
    parse<T extends Node>(src: string): T;
  }
}

declare module 'rehype-parse' {
  const parser: any;
  export default parser;

  export interface ParserOptions {
    fragment?: boolean;
    space?: 'html' | 'svg';
    emitParseErrors?: boolean;
    verbose?: boolean;
  }
}

declare module 'property-information';
