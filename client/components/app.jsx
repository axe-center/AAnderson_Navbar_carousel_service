import React from 'react';
import Tag from './Tag.jsx';
import Carousel from './carousel.jsx';
import axios from 'axios';
import Slider from 'react-slick';


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tags: [],
            carouselBegin: 0,
            carouselEnd: 5,
            currentId: 0,
            currentTag: '',
            axes: [
                {
                    name: 'fighty axe',
                    tag: 'battle',
                    image: `https://s3.us-east-2.amazonaws.com/axes/battle+axe/1.+battle-axe.jpg`,
                    id: 1
                }
            ]
        }
    };

    componentDidMount() {
        axios.get('http://localhost:3005/api/products')
        .then(results => {
            const tagArr = [];
            const tagObj = {};
            for (let obj of results.data) {
                if (tagObj[obj.tag] === undefined) {
                    tagArr.push(obj.tag);
                    tagObj[obj.tag] = 1;
                }
            }
            this.setState({
                tags: tagArr,
                axes: results.data
            });
        })
    };

    handleRightCarouselClick(e) {
        e.preventDefault();

        if (this.state.carouselEnd <= this.findallAxesFromTag(this.state.currentTag).length) {
            let upperBound = this.state.carouselEnd + 5;
            let lowerBound = this.state.carouselBegin + 5;
    
            this.setState({
                carouselBegin: lowerBound,
                carouselEnd: upperBound
            })
        } else {
            this.setState({
                carouselBegin: 0,
                carouselEnd: 5
            })
        }
    };

    handleLeftCarouselClick(e) {
        e.preventDefault();
        if (this.state.carouselBegin !== 0) {
            if ((this.state.carouselEnd - this.state.carouselBegin) < 5) {
                let upperBound = this.state.carouselEnd - (this.state.carouselEnd % 5);
                let lowerBound = upperBound - 5;
    
                this.setState({
                    carouselBegin: lowerBound,
                    carouselEnd: upperBound
                })
            } else {
                let upperBound = this.state.carouselEnd - 5;
                let lowerBound = upperBound - 5;
        
                if (lowerBound >= 0) {
                    this.setState({
                        carouselBegin: lowerBound,
                        carouselEnd: upperBound
                    })
                } 
            }
        } else {
            let upperBound = this.findallAxesFromTag(this.state.currentTag).length;
            let lowerBound = upperBound - (this.findallAxesFromTag(this.state.currentTag).length % 5)
            this.setState({
                carouselBegin: lowerBound,
                carouselEnd: upperBound
            })
        }
    };

    handleProductClick(e, id, tag) {
        e.preventDefault();
        
        this.setState({
            currentId: id,
            currentTag: tag,
            carouselBegin: 0,
            carouselEnd: 5
        })
    }

    findallAxesFromTag(tag) {
        const axes = this.state.axes
        const taggedAxes = [];
        for (let i =0 ; i < axes.length; i++) {
            if (axes[i].tag === tag) {
                taggedAxes.push(axes[i]);
            }
        }

        return taggedAxes
    };

    

    render() {

        var settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 5,
            slidesToScroll: 5,
            arrows: true
          
        };
        return (
        <div id = 'Container'>
             {this.state.currentId}
             <div id= 'NavBarParent'>
                 {this.state.tags.map((tag, index) => {
                    return <Tag tag = {tag} length = {this.state.tags.length} axes = {this.findallAxesFromTag(tag)} key = {index} handleProductClick = {this.handleProductClick.bind(this)}/> 
                })}
            </div>
            <div style = {{height: '500px'}}></div>
            <div>
                <div className='carousel_Container'>
                    <Slider {...settings}>
                        {this.findallAxesFromTag(this.state.currentTag).map((axe, index) => {
                            if (this.state.currentId !== axe.productId) {
                                return <Carousel axe = {axe} key = {index} handleProductClick = {this.handleProductClick.bind(this)}/>
                            }   
                        })}
                    </Slider>
                </div>
            </div>
        </div>
        )
    }
}

export default App;


//homemade carousel
/*
<div>
                        <input id = 'leftCarouselButton' onClick = {(e) => {this.handleLeftCarouselClick(e)}} type = 'submit' name ='lbutton' value = 'lbutton'/>
                    </div>
                    <div id = 'carousel'>
                        {this.findallAxesFromTag(this.state.currentTag).map((axe, index) => {
                            if (index >= this.state.carouselBegin && index < this.state.carouselEnd && this.state.currentId !== axe.id) {
                                return <Carousel axe = {axe} key = {index} handleProductClick = {this.handleProductClick.bind(this)}/>
                            }   
                        })}
                    </div>
                    <div>
                        <input onClick = {(e) => {this.handleRightCarouselClick(e)}} type = 'submit' name ='rbutton' value = 'rbutton'/>
                    </div>
*/