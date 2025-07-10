import PropTypes from 'prop-types';

const ExampleCarouselImage = ({ src }) => {
    return (
        <img
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            src={src}
        />
    );
};

ExampleCarouselImage.propTypes = {
    src: PropTypes.string.isRequired,
};

export default ExampleCarouselImage;