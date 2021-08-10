const Loader = ({show}) => {
    return show ? <div className="loader">
        <div className="loader__container">
            <div className="loader__container__item"></div>
        </div>
        <div className="loader__container">
            <div className="loader__container__item"></div>
        </div>
        <div className="loader__container">
            <div className="loader__container__item"></div>
        </div>
    </div> : null;
}

export default Loader;