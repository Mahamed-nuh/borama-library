import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClass = `spinner-${size}`;
  
  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className={`spinner ${sizeClass}`}></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
