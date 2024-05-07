const Button = ({
  label,
  iconURL,
  type,
  onClick,
  width,
  bgColor
}) => {

  return (
    <button
      className={`inline-flex px-4 py-2 text-white bg-[#4361ee] hover:shadow-lg hover:scale-105 transition-transform duration-300 focus:bg-[#3e5ff2] rounded-md ml-6 mb-3 w-${width} justify-center`}
      onClick={onClick} type={type}
      style={{background:`${bgColor}`}}
    >
      {iconURL && (
        <p className="text-1xl mt-1 mr-1">{iconURL}</p>
      )}
      {label}
    </button>
  )
}

export default Button;