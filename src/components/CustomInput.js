import React, { useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion";

const CustomInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  name,
  className = ""
}) => {
  const inputRef = useRef(null);
  const [animationState, setAnimationState] = useState("outfocus");

  const handleLabelClick = () => {
    inputRef.current.focus();
  };

  const handleInputChange = (e) => {
    if(e.target.value == ""){
      setAnimationState("outfocus")
    } else {
      setAnimationState("onfocus")
    }
    if (onChange) {
      onChange(e);
    }
  };

  const variants = {
    onfocus: { y: 12, x: 6, backgroundColor: '#fff' },
    outfocus: { scale: 1.1, y: 35, x: 8, backgroundColor: 'transparent' },
  }

  return (
    <div className={`d-flex flex-column ${className}`}>
      <motion.div transition={{ bounce: 0, duration: 0.1 }} className='p-0 px-1' style={{ width: 'fit-content', height: 'fit-content' }} animate={animationState} variants={variants} onClick={handleLabelClick}>
        {label}
      </motion.div>
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={handleInputChange}
        name={name}
        onFocus={() => setAnimationState("onfocus")}
        onBlur={() => {
          if(inputRef.current.value == ""){
            setAnimationState("outfocus")
          } else {
            setAnimationState("onfocus")
          }
        }}
        placeholder={placeholder}
        required={required}
        className='p-2'
      />
    </div>
  );
};

export default CustomInput;