import unified from 'unified';
import rehypeParser, { ParserOptions } from 'rehype-parse';
import HAST from 'hast';

const rehype = unified().use<ParserOptions>(rehypeParser, {
  fragment: true,
  space: 'svg',
});

export default function parse(src: string): HAST.Root {
  return rehype.parse<HAST.Root>(src);
}
