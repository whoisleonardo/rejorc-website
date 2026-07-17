import { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { api, API_URL } from '../../api';

/**
 * Editor de texto completo (estilo Word): títulos, negrito/itálico/sublinhado,
 * cores, alinhamento, listas, citação, link e imagem. Imagens sobem pelo
 * upload do painel e entram como URL (nunca base64).
 */
export default function RichTextField({ label, value, onChange, placeholder }) {
  const quillRef = useRef(null);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['blockquote', 'link', 'image'],
          ['clean'],
        ],
        handlers: {
          image() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/png,image/jpeg,image/webp,image/gif';
            input.onchange = async () => {
              const file = input.files && input.files[0];
              if (!file) return;
              try {
                const { url } = await api.uploadImage(file);
                const quill = quillRef.current && quillRef.current.getEditor();
                if (!quill) return;
                const range = quill.getSelection(true);
                quill.insertEmbed(range ? range.index : 0, 'image', `${API_URL}${url}`);
              } catch (err) {
                alert(`Falha no upload da imagem: ${err.message}`);
              }
            };
            input.click();
          },
        },
      },
    }),
    []
  );

  return (
    <div className="field">
      {label && <label>{label}</label>}
      <div style={{ background: '#fff', borderRadius: 10 }}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value || ''}
          onChange={onChange}
          modules={modules}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
