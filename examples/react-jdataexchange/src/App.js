import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import jdx from '../../../src/jdataexchange';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "note": "note",
            "_csrf": "test",
            "name": "1112",
            "password": "212312",
            "sex": "Male",
            "fruit": [
                "Apple",
                "Banana",
                "Orange"
            ],
            "country": "中国",
            "sport": [
                "足球",
                "篮球"
            ]
        };

    }


    handleSubmit = (event) => {
        this.handleGet();
        alert(JSON.stringify(this.state, null, 4));    
        event.preventDefault();
    }


    handleGet = ()=> {
        let data = {};
        jdx(this.refs.myform).get(data);
        jdx(this.refs.mydisplay).set({json:JSON.stringify(data, null, 4)});
        this.setState(data);
    };

    handleSet = ()=> {
        let data = {};
        let temp = {};
        jdx(this.refs.mydisplay).get(temp);
        data = JSON.parse(temp.json);
        this.setState(data);
    };

    render() {
        return (
            <table style={{ border: 1 }} cellSpacing="0">
                <tbody>
                <tr>
                    <td>
                        <form ref="myform" onSubmit={this.handleSubmit} onChange={this.handleGet}>
                            Hidden: <input name="_csrf" type="hidden" value={this.state._csrf} /> <br/>
                            Name: <input name="name" type="text" value={this.state.name} /> <br/>
                            Password: <input name="password" type="password" value={this.state.password} /> <br/>
                            Sex: <input name="sex" type="radio" value="Male" checked={this.state.sex==="Male"} />Male
                            <input name="sex" type="radio" value="Female" checked={this.state.sex==="Female"} />Female <br/>
                            Fruit: <input name="fruit" type="checkbox" value="Apple" checked={this.state.fruit.includes("Apple")} />Apple
                            <input name="fruit" type="checkbox" value="Banana" checked={this.state.fruit.includes("Banana")} />Banana
                            <input name="fruit" type="checkbox" value="Orange" checked={this.state.fruit.includes("Orange")} />Orange <br/>
                            Country: <select name="country" value={this.state.country} >
                            <option value="">--请选择--</option>
                            <option value="中国">中国</option>
                            <option value="美国">美国</option>
                            </select><br/>
                            Sport: <select name="sport" multiple="multiple" >
                            <option value="足球" selected={this.state.sport.includes("足球")}>足球</option>
                            <option value="篮球" selected={this.state.sport.includes("篮球")}>篮球</option>
                            <option value="乒乓球" selected={this.state.sport.includes("乒乓球")}>乒乓球</option>
                            </select><br/>
                            Note: <textarea name="note" value={this.state.note} ></textarea><br/>
                            <input type="reset" value="Reset"/> <br/>
                            <input type="submit" value="Submit" /><br/>
                        </form>
                    </td>
                    <td>
                        <input type="BUTTON" value=">>" onClick={this.handleGet}/><br/><br/>
                        <input type="BUTTON" value="<<" onClick={this.handleSet}/><br/>
                    </td>
                    <td>
                        <div ref="mydisplay">
                            <textarea name="json" rows="20" cols="50"></textarea>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        );
    }
}

export default App;
