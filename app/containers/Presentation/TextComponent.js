import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import ContentEditable from 'react-contenteditable';
import { Rnd } from 'react-rnd';
import CKEditor from 'ckeditor4-react';
import ReactHtmlParser from 'react-html-parser';
import { Text, Heading } from 'spectacle';
import TextEditor from './text-editor';
// import onClickOutside from 'react-onclickoutside';
import {
  selectDeckOfSlides,
  selectCurrentSlide,
  selectCurrentTextArray,
} from './selectors';
import { addData, changePosition } from './actions';
import './styles.css';
export function TextComponent({
  DeckOfSlides,
  currentSlide,
  onAddData,
  textArrayEntry,
  onChangePosition,
  currentTextArray,
}) {
  const node = useRef();
  const rndRef = useRef();
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // position: 'absolute',
  };
  // single-double click handlers
  const [textEdit, setTextEdit] = useState(false);
  // text's content
  const [text, setText] = useState(currentTextArray[textArrayEntry].data);
  // text's position
  // const text = currentTextArray[textArrayEntry].data;
  const pos = currentTextArray[textArrayEntry].position;
  let clickTimeout = null;
  const [position, setPosition] = useState({
    width: pos.width,
    height: pos.height,
    x: pos.x,
    y: pos.y,
  });
  const onChangeFunc = input => {
    setText(input);
    onAddData(textArrayEntry, input);
  };

  const onDoubleClick = evt => {
    evt.preventDefault();
    console.log('double clicki');
    // if (node.current.contains(evt.target)) {
    // inside click
    // then edit
    setTextEdit(true);
    // }
  };

  const handleClick = e => {
    if (node.current.contains(e.target)) {
      // inside click
      // then move
      return;
    }
    // outside click
    setTextEdit(false);
  };

  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClick);

  //   return () => {
  //     document.removeEventListener('mousedown', handleClick);
  //   };
  // });
  // i have to unsubscribe the component when the other component is being rendered
  const handleClicks = e => {
    if (clickTimeout !== null) {
      console.log('double click executes');
      if (!textEdit) setTextEdit(true);
      clearTimeout(clickTimeout);
      clickTimeout = null;
    } else {
      console.log('single click');
      handleClick(e);
      clickTimeout = setTimeout(() => {
        console.log('first click executes ');
        clearTimeout(clickTimeout);
        clickTimeout = null;
      }, 2000);
    }
  };
  const onHandlePosition = (evt, posi) => {
    evt.preventDefault();
    onChangePosition(textArrayEntry, posi);
    setPosition(posi);
    // const { offsetTop } = node.current;
    // console.log('offsetTop: ', offsetTop);
  };
  // {/* <div left={`${position.x}px`} top={`${position.y}px`}> */ }
  // {/* </div> */}
  const nodeClick = e => {
    console.log('nodeclick////');
    if (rndRef.current.contains(e.target)) {
      // inside click
      console.log('click sto rnd');

      // then move
      return;
    }
    console.log('click ston editor');
    // outside click
    setTextEdit(false);
  };

  return (
    <div
      ref={node}
      // onDoubleClick={onDoubleClick}
      // style={{ top: position.x, left: position.y }}
      onClick={handleClicks}
    >
      {textEdit ? (
        <TextEditor initialContent={text} textUpdateFunction={onChangeFunc} />
      ) : (
        <Rnd
          ref={rndRef}
          className="text-style"
          style={style}
          // default={position}
          size={{ width: position.width, height: position.height }}
          position={{ x: position.x, y: position.y }}
          // onDragStop={(e, d) => {
          //   onHandlePosition(e, {
          //     width: position.width,
          //     height: position.height,
          //     x: d.x,
          //     y: d.y,
          //   });
          //   //   // d.y is going up when i drag down
          //   //   // d.x is going up when i drag left
          // }}
          // onResizeStop={(e, direction, ref, delta, posi) => {
          //   onHandlePosition(e, {
          //     width: ref.style.width,
          //     height: ref.style.height,
          //     ...posi,
          //   });
          // }}
          minWidth={500}
          minHeight={70}
          bounds="body"
          // onClick={e => handleClicks(e)}
        >
          {ReactHtmlParser(text)}
        </Rnd>
      )}
    </div>
  );
}

TextComponent.propTypes = {
  DeckOfSlides: PropTypes.array,
  currentSlide: PropTypes.number,
  onAddData: PropTypes.func,
  textArrayEntry: PropTypes.number,
  onChangePosition: PropTypes.func,
  currentTextArray: PropTypes.array,
};

export function mapDispatchToProps(dispatch) {
  return {
    onAddData: (id, data) => dispatch(addData(id, data)),
    onChangePosition: (id, position) => dispatch(changePosition(id, position)),
  };
}

export default connect(
  state => ({
    DeckOfSlides: selectDeckOfSlides(state),
    currentSlide: selectCurrentSlide(state),
    currentTextArray: selectCurrentTextArray(state),
  }),
  mapDispatchToProps,
)(TextComponent);

// <CKEditor
//           // this is to prevent an error with the editor that multiple instances of the editor exists
//           // eslint-disable-next-line no-return-assign
//           onBeforeLoad={CKEDITOR => (CKEDITOR.disableAutoInline = true)}
//           data={text}
//           type="inline"
//           onChange={onChangeFunc}
//         />
