// RichTextEditor — TipTap-based body editor for news cards.
// Toolbar: bold, italic, underline, h3, ul, ol, link, red text, paragraph.
// Same Tailwind classes the public site uses, so WYSIWYG = final render.

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle, Color } from '@tiptap/extension-text-style';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading3,
  Pilcrow,
  Type,
} from 'lucide-react';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const TOOLBAR_BTN = 'p-1.5 rounded hover:bg-white/10 text-gray-300 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent';
const ACTIVE_BTN = 'bg-red-600/30 text-white';

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${TOOLBAR_BTN} ${active ? ACTIVE_BTN : ''}`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [3] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { class: 'text-red-500 hover:text-white underline' } }),
      TextStyle,
      Color,
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none min-h-[120px] p-3 focus:outline-none text-gray-200 [&_a]:text-red-500 [&_a]:hover:text-white [&_a]:underline [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mb-3 [&_h3]:mt-6 [&_ul]:space-y-2 [&_ol]:space-y-2 [&_p]:mb-4 [&_p:last-child]:mb-0',
      },
    },
  });

  if (!editor) return <div className="text-gray-500 text-sm">Loading editor…</div>;

  function setLink() {
    const prev = editor!.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL (leave empty to remove):', prev || 'https://');
    if (url === null) return;
    if (url === '') {
      editor!.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank', rel: 'noopener noreferrer' }).run();
  }

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-white/[0.03]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-white/10 bg-black/40">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <span className="w-px h-5 bg-white/10 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive('paragraph')}
          title="Paragraph"
        >
          <Pilcrow className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
        <span className="w-px h-5 bg-white/10 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bulleted list"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered list"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <span className="w-px h-5 bg-white/10 mx-1" />
        <ToolbarButton
          onClick={setLink}
          active={editor.isActive('link')}
          title="Insert link"
        >
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setColor('#ef4444').run()}
          active={editor.isActive('textStyle', { color: '#ef4444' })}
          title="Red text"
        >
          <span className="text-red-500 font-bold text-xs px-1">A</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setColor('#22c55e').run()}
          active={editor.isActive('textStyle', { color: '#22c55e' })}
          title="Green text"
        >
          <span className="text-green-500 font-bold text-xs px-1">A</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setColor('#ffffff').run()}
          active={editor.isActive('textStyle', { color: '#ffffff' })}
          title="White bold text"
        >
          <span className="text-white font-semibold text-xs px-1">A</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetColor().run()}
          title="Reset color"
        >
          <Type className="w-4 h-4" />
        </ToolbarButton>
      </div>
      {/* Editable area */}
      <EditorContent editor={editor} />
    </div>
  );
}
