import React, { Component } from 'react';
import ReactCopper from 'react-easy-crop';
import getCroppedImg from './getimage';

export default class Cropper extends Component 
{

    constructor(props) 
    {
        super(props)
        this.state = 
        {
            image: props.image,
            crop: { x: 0, y: 0 },
            zoom: 1,
            aspect: this.props.aspect,
            loading: false,
            croppedAreaPixels: {}
        }

    }
    
    
    onCropChange = crop => 
    {
        this.setState({ crop })
    }
     
    onZoomChange = zoom => 
    {
        this.setState({ zoom: zoom })
    }

    get_image = async () =>
    { 
        this.setState({loading: true})
        const image = await getCroppedImg(this.state.image , this.state.croppedAreaPixels, 0)
        if(image)
        {
            
            this.props.set_new_image(image)
            this.props.hide_n_show_cutter_element()
        }
    }

    croppedAreaPixels = (a, b) =>
    {
        this.setState({croppedAreaPixels: b})
    }

    render() {
        return (
        <div className="image-cutter-element">
            <div className="image-cutter-element__container">
                <ReactCopper 
                    className="cropper-element"
                    image={this.state.image}
                    crop={this.state.crop}
                    zoom={this.state.zoom}
                    aspect={this.state.aspect}
                    zoomSpeed={.05}
                    onCropComplete={this.croppedAreaPixels}
                    onCropChange={this.onCropChange}
                    onZoomChange={this.onZoomChange}/>
                <div className="image-cutter-element__buttons">
                    {!this.state.loading 
                    ? <button onClick={this.get_image} className="image-cutter-element__button">listo</button> : 
                    <div className="loading-element" style={{height: "40px", width: "50px"}}>
                        <div className="loading-animation" style={{height: "30px", width: "30px"}}>
                        </div>
                    </div>}
                </div>
            </div>
        </div>)
    }
}

