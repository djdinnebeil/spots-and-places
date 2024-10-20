// frontend/src/components/CreateNewSpotPage/CreateNewSpotPage.jsx
import './CreateNewSpotPage.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewSpot, updateSpot } from '../../store/spots';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSpotDetailsAndReviews } from '../../store/spotDetails';

function CreateNewSpotPage( { isUpdate = false}) {
  const { spotId } = useParams();
  const spotDetails = useSelector((state) => state.spotDetails.spot);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    country: '',
    address: '',
    city: '',
    state: '',
    description: '',
    name: '',
    price: '',
    previewImage: '',
    photo1: '',
    photo2: '',
    photo3: '',
    photo4: ''
  });

  const [errors, setErrors] = useState({});

  // Find spot details when in update mode
  useEffect(() => {
    if (isUpdate && spotId) {
      dispatch(fetchSpotDetailsAndReviews(spotId));
    }
  }, [dispatch, spotId, isUpdate]);

  useEffect(() => {
    if (isUpdate && spotDetails) {
      setFormData({
        country: spotDetails.country || '',
        address: spotDetails.address || '',
        city: spotDetails.city || '',
        state: spotDetails.state || '',
        description: spotDetails.description || '',
        name: spotDetails.name || '',
        price: spotDetails.price || '',
        previewImage: spotDetails.previewImage || 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/default-image-url.jpg',
        photo1: spotDetails.photo1 || '',
        photo2: spotDetails.photo2 || '',
        photo3: spotDetails.photo3 || '',
        photo4: spotDetails.photo4 || '',
      });
    } else {
      setFormData({
        country: '',
        address: '',
        city: '',
        state: '',
        description: '',
        name: '',
        price: '',
        previewImage: '',
        photo1: '',
        photo2: '',
        photo3: '',
        photo4: ''
      })
    }
    }, [isUpdate, spotDetails]);

  const validateForm = () => {
    const newErrors = {};

    // Basic field validations
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';

    if (!formData.description || formData.description.length < 30) newErrors.description = 'Description needs 30 or more characters';


    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.price) newErrors.price = 'Price per night is required';

    // Image validation logic
    const imageFields = ['previewImage', 'photo1', 'photo2', 'photo3', 'photo4'];

    imageFields.forEach((field) => {
      const value = formData[field];
      if (value && !/\.(png|jpg|jpeg)$/i.test(value)) {
        if (field === 'previewImage') {
          field = 'photo0';
        }
        newErrors[field] = 'Image URL must end in .png, .jpg, or .jpeg';
      }
    });

    if (!formData.previewImage) {
      newErrors.previewImage = 'Preview Image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (isUpdate) {
          await dispatch(updateSpot(spotId, formData));
          navigate(`/spots/${spotId}`);
        } else {
          const newSpot = await dispatch(createNewSpot(formData));
          navigate(`/spots/${newSpot.id}`);
        }
      } catch (error) {
        console.error('Error creating spot:', error);
      }
    }
  };
  return (
    <div className="create-spot-form-div">
      {isUpdate && <h1>Update your Spot</h1>}
      {!isUpdate && <h1 data-testid={'form-title'}>Create a New Spot</h1>}
      <form className="create-spot-form" onSubmit={handleSubmit} data-testid={'create-spot-form'}>
        <div data-testid={'section-1'}>
          <h3 data-testid={'section-1-heading'}>Where&apos;s your place located?</h3>
          <p data-testid={'section-1-caption'}>Guests will only get your exact address once they booked a
            reservation.</p>
          <br/>
          <label htmlFor="country">Country {errors.country &&
            <span className="error-create-new-spot-page">{errors.country}</span>}</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
          />
          <label htmlFor="address">Street Address {errors.address &&
            <span className="error-create-new-spot-page">{errors.address}</span>}</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street Address"
          />
          <div className="city-state">
            <div className="city-class">
              <label htmlFor="city">City {errors.city &&
                <span className="error-create-new-spot-page">{errors.city}</span>}</label>
              <div className="input-with-comma">
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
                <span className="comma">,</span>
              </div>
            </div>
            <div className="state-class">
              <label htmlFor="state">State {errors.state &&
                <span className="error-create-new-spot-page">{errors.state}</span>}</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>
          </div>
          <div className="lat-long">
            <div className="lat-class">
              <label htmlFor="latitude">Latitude (Optional)</label>
              <div className="input-with-comma">
                <input
                  type="text"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="Latitude (Optional)"
                />
                <span className="comma">,</span>
              </div>
            </div>

            <div className="lng-class">
              <label htmlFor="longitude">Longitude (Optional)</label>
              <input
                type="text"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Longitude (Optional)"
              />
            </div>
          </div>
        </div>
      <hr/>
        <div data-testid={'section-2'}>
      <h3 data-testid={'section-2-heading'}>Describe your place to guests</h3>
      <p data-testid={'section-2-caption'}>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
          <br/>
      <textarea
        id="description"
        name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            placeholder="Please write at least 30 characters"
          />
          {errors.description && <span className="error-create-new-spot-page">{errors.description}</span>}
          <hr/>
        </div>
        <div data-testid={'section-3'}>
          <h3 data-testid={'section-3-heading'}>Create a title for your spot</h3>
          <p data-testid={'section-3-caption'}>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
          <br/>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name of your spot"
          />
          {errors.name && <span className="error-create-new-spot-page">{errors.name}</span>}

        </div>
          <hr/>
        <div data-testid={'section-4'}>
          <h3 data-testid={'section-4-heading'}>Set a base price for your spot</h3>
          <p data-testid={'section-4-caption'}>Competitive pricing can help your listing stand out and rank higher
            in search results.</p>
          <br/>
          <div className="dollar-sign-price">
            <span className="dollar-sign-span">$</span>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price per night (USD)"
            />
          </div>
          {errors.price && <span className="error-create-new-spot-page">{errors.price}</span>}
        </div>
          <hr/>
        <div data-testid={'section-5'}>
          <h3 data-testid={'section-5-heading'}>Liven up your spot with photos</h3>
          <p data-testid={'section-5-caption'}>Submit a link to at least one photo to publish your spot.</p>
          <br/>
          <input
            type="url"
            id="previewImage"
            name="previewImage"
            value={formData.previewImage}
            onChange={handleChange}
            placeholder="Preview Image URL"
          />
        {errors.previewImage && <span className="error-create-new-spot-page">{errors.previewImage}</span>}
        {errors.photo0 && <span className="error-create-new-spot-page">{errors.photo0}</span>}

        <div className="additional-images">
            <input
              type="url"
              name="photo1"
              value={formData.photo1}
              onChange={handleChange}
              placeholder="Image URL"
            />
            {errors.photo1 && <span className="error-create-new-spot-page">{errors.photo1}</span>}
            <input
              type="url"
              name="photo2"
              value={formData.photo2}
              onChange={handleChange}
              placeholder="Image URL"
            />
            {errors.photo2 && <span className="error-create-new-spot-page">{errors.photo2}</span>}

            <input
              type="url"
              name="photo3"
              value={formData.photo3}
              onChange={handleChange}
              placeholder="Image URL"
            />
            {errors.photo3 && <span className="error-create-new-spot-page">{errors.photo3}</span>}

            <input
              type="url"
              name="photo4"
              value={formData.photo4}
              onChange={handleChange}
              placeholder="Image URL"
            />
            {errors.photo4 && <span className="error-create-new-spot-page">{errors.photo4}</span>}
        </div>
          </div>

          <hr/>
        {isUpdate && <button type="submit" className="create-spot-button">Update your Spot</button>}
        {!isUpdate && <button type="submit" className="create-spot-button">Create Spot</button>}
      </form>
    </div>
);
}

export default CreateNewSpotPage;
