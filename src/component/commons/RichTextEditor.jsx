import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

const RichTextEditor = ({ value, onChange, id, name }) => {
  return (
    <SunEditor
      setContents={value}
      onChange={onChange}
      height="250px"
      name={name}
      id={id}
      className=""
      placeholder=""
      setOptions={{
        buttonList: [
          ["undo", "redo"],
          ["font", "fontSize"],
          ["formatBlock"],
          ["paragraphStyle", "blockquote"],
          ["bold", "underline", "italic", "strike", "subscript", "superscript"],
          // ["fontColor", "hiliteColor"],
          ["removeFormat"],
          //   ["outdent", "indent"],
          //   ["align", "horizontalRule", "list", "lineHeight"],
          //   ["table", "link", "image", "video", "audio"],
          //   ["fullScreen", "showBlocks", "codeView"],
          //   ["preview", "print"],
          //   ["save", "template"]
        ],
        // Additional configuration options
        // defaultTag: "div",
        // minHeight: "200px",
        // maxHeight: "500px",
        // resizingBar: true,
        // Enable all formats
        formats: [
          "p", "div", "h1", "h2", "h3", "h4", "h5", "h6",
          "pre", "blockquote"
        ],
        // font: [
        //   "Arial", "Comic Sans MS", "Courier New",
        //   "Georgia", "Impact", "Tahoma",
        //   "Times New Roman", "Trebuchet MS", "Verdana"
        // ],
        // fontSize: [8, 10, 12, 14, 16, 18, 24, 36],
        // Show all available features
        // showPathLabel: false,
        // charCounter: true,
        // charCounterType: "char",
        // charCounterLabel: "Characters:"
      }}
    />
  );
};

export default RichTextEditor;