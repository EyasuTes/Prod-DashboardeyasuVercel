// https://stackoverflow.com/questions/68690135/how-to-get-the-html-content-from-react-draft-wysiwyg-from-the-child-component-to
import React, { useState, useEffect } from 'react'
// import Parser from 'html-react-parser'
import PropTypes from 'prop-types'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './RichTextEditor.css'

let i = 0
let forActivity = 0
const ShowHtmlEditor = ({ HandleFormData2, PageContent, PageTitle }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(PageContent))),
  )

  const handleEditorChange = (state) => {
    setEditorState(state)
    sendContent()
  }

  const sendContent = () => {
    // getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    HandleFormData2('description', draftToHtml(convertToRaw(editorState.getCurrentContent())))
    console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }

  useEffect(() => {
    i = 0
    // console.log(`forActivity : ${forActivity}`)
    // console.log(`PageTitle : ${PageTitle}`)
    if (i === 0 && forActivity !== PageTitle) {
      forActivity = PageTitle
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(convertFromHTML(PageContent)),
        ),
      )
    }
  }, [PageTitle, PageContent])

  return (
    <div>
      <div
        onClick={() => {
          // i = 1
        }}
      >
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          toolbarClassName="toolbar-class"
        />
      </div>
    </div>
  )
}

ShowHtmlEditor.propTypes = {
  HandleFormData2: PropTypes.any,
  PageContent: PropTypes.any,
  PageTitle: PropTypes.any,
}

export default ShowHtmlEditor
