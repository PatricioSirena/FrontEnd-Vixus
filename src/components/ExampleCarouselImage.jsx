import PropTypes from 'prop-types';

const ExampleCarouselImage = ({ src }) => {
    return (
        <img
            className="d-block w-100"
            src={src}
        />
    );
};

ExampleCarouselImage.propTypes = {
    src: PropTypes.string.isRequired,
};

export default ExampleCarouselImage;