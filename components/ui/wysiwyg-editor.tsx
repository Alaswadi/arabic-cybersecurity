"use client"

import { useRef, useState } from "react"
import { Editor } from "@tinymce/tinymce-react"
import { Label } from "@/components/ui/label"
import { adminTheme } from "@/lib/admin-theme"

interface WysiwygEditorProps {
  id: string
  label?: string
  value: string
  onChange: (value: string) => void
  height?: number
  required?: boolean
  placeholder?: string
  dir?: "rtl" | "ltr"
}

export function WysiwygEditor({
  id,
  label,
  value,
  onChange,
  height = 500,
  required = false,
  placeholder = "",
  dir = "rtl"
}: WysiwygEditorProps) {
  const editorRef = useRef<any>(null)
  const [isEditorReady, setIsEditorReady] = useState(false)

  // TinyMCE API key - using the free cloud version
  // In production, you should use your own API key
  const apiKey = "qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc"

  return (
    <div className="space-y-2">
      {label && (
        <Label
          htmlFor={id}
          style={{ color: adminTheme.colors.text.primary }}
          className="block mb-2"
        >
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </Label>
      )}

      <div className="border rounded-md" style={{ borderColor: adminTheme.colors.border.main }}>
        <Editor
          id={id}
          apiKey={apiKey}
          onInit={(evt, editor) => {
            editorRef.current = editor
            setIsEditorReady(true)
          }}
          initialValue={value}
          value={value}
          onEditorChange={(newValue) => {
            onChange(newValue)
          }}
          init={{
            height,
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'directionality'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help | ltr rtl',
            directionality: dir,
            placeholder: placeholder,
            // Add Arabic language support
            language: 'ar',
            // Add custom styles for Arabic text
            content_css: [
              'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap',
              'default'
            ],
            // Override default font settings for Arabic
            font_formats:
              'Cairo=cairo,sans-serif;' +
              'Andale Mono=andale mono,times;' +
              'Arial=arial,helvetica,sans-serif;' +
              'Arial Black=arial black,avant garde;' +
              'Book Antiqua=book antiqua,palatino;' +
              'Comic Sans MS=comic sans ms,sans-serif;' +
              'Courier New=courier new,courier;' +
              'Georgia=georgia,palatino;' +
              'Helvetica=helvetica;' +
              'Impact=impact,chicago;' +
              'Symbol=symbol;' +
              'Tahoma=tahoma,arial,helvetica,sans-serif;' +
              'Terminal=terminal,monaco;' +
              'Times New Roman=times new roman,times;' +
              'Trebuchet MS=trebuchet ms,geneva;' +
              'Verdana=verdana,geneva;' +
              'Webdings=webdings;' +
              'Wingdings=wingdings,zapf dingbats',
            // Set default font to Cairo for Arabic text
            content_style: `
              @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
              body { font-family: 'Cairo', sans-serif; font-size: 16px; direction: ${dir}; }
              .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                direction: ${dir};
                text-align: ${dir === 'rtl' ? 'right' : 'left'};
              }
            `,
            // Add custom CSS for RTL support
            setup: function(editor) {
              editor.on('init', function() {
                editor.getBody().dir = dir;
              });
            }
          }}
        />
      </div>
    </div>
  )
}
