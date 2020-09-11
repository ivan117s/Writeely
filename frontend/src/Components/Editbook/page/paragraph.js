import React, { Component, createRef } from 'react'

export default class Paragraph extends Component 
{
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
        this.paragraphEditable = createRef()
    }
    
    componentDidMount()
    {
        this.paragraphEditable.current.innerText = this.props.paragraph.content
        if(this.props.paragraph.new)
        {
            this.paragraphEditable.current.focus()
            this.props.update_paragraph(this.props.index, {new: false})
        }
    }

    

    get_chart_position = () =>
    {
        var node = this.paragraphEditable.current;
        var range = window.getSelection().getRangeAt(0);
        var treeWalker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            function(node) {
                var nodeRange = document.createRange();
                nodeRange.selectNode(node);
                return nodeRange.compareBoundaryPoints(Range.END_TO_END, range) < 1 ?
                    NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            },
            false
        );
    
        var charCount = 0;
        while (treeWalker.nextNode()) {
            charCount += treeWalker.currentNode.length;
        }
        if (range.startContainer.nodeType == 3) {
            charCount += range.startOffset;
        }
        return charCount;
    }

    Change_paragraph = (e) =>
    {
        let new_paragraph =  Object.assign(this.props.paragraph, {content: e.target.innerText })
        this.props.update_paragraph(this.props.index, new_paragraph )
    }

    Key_down_paragraph = (e) =>
    {
        if(!this.props.limit)  
        {
            const chartPosition = this.get_chart_position();
            if(e.key === "Enter")
            {
                e.preventDefault()
                if(chartPosition < e.target.innerText.length && chartPosition > 0 )
                {
                    this.props.insert_paragraph("slice", chartPosition, this.props.index)
                }
            }
            else if(e.key === "Backspace")
            {
               
                if(chartPosition === 0)  this.props.remove_paragraph(this.props.index)
            } else e.preventDefault()
        }
        else 
        {
            if(e.key === "Enter") 
            {
                e.preventDefault()
                
                const chartPosition = this.get_chart_position();
                switch (chartPosition) 
                {
                    case e.target.innerText.length:
                        this.props.insert_paragraph("bottom", chartPosition, this.props.index)
                    break;
                    case 0:
                        this.props.insert_paragraph("top", chartPosition, this.props.index)
                    break;
                    default:
                        break; 
                }
                if(chartPosition < e.target.innerText.length && chartPosition > 0 )
                {
                    this.props.insert_paragraph("slice", chartPosition, this.props.index)
                }
            } 
            else if(e.key === "Backspace")
            {
                const chartPosition = this.get_chart_position();
                if(chartPosition === 0)  this.props.remove_paragraph(this.props.index)
            }
        }
        
    }

    Set_styles = () =>
    {
        let styles = 
        {
            font_size: this.props.paragraph.font_size,
            text_align: this.props.paragraph.text_align,
        }
        this.props.set_styles_config(styles, this.props.index, true)
    }

    Set_default_styles = (e) =>
    {
        let styles = 
        {
            font_size: 20,
            text_align: "left",
        }
        this.props.set_styles_config(styles, this.props.index, false)
    }

    render() 
    {
        const classfocused = 
        this.props.focused === this.props.index ? 
        " edit-book-element-paragraph-editable--focused" : ""
        
        return(
        <div className={"edit-book-element-paragraph-editable" + classfocused}>
            <p 
                onFocus={this.Set_styles}
                onInput={(e) => this.Change_paragraph(e)}
                onKeyDown={(e) => this.Key_down_paragraph(e)} 
                style={
                {
                    fontSize: this.props.paragraph.font_size + "px", 
                    textAlign: this.props.paragraph.text_align 
                }} 
                ref={this.paragraphEditable} 
                contentEditable></p>
        </div>)
    }
}
