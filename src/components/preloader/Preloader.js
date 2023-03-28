const Preloader = ({ text }) => {
  return (
    <section className="preloader_container">
      <div className="preloader__circle"></div>
      <span className="preloader__text">Please wait, we are trying to {text}.</span>
    </section>
  );
};

export default Preloader;