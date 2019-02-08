import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import jdx from '../../../src/jdataexchange';

class App extends Component {

    handleGet = ()=> {
        let data = {};
        jdx(this.refs.myform).get(data);
        jdx(this.refs.mydisplay).set({json:JSON.stringify(data, null, 4)})
    };

    handleSet = ()=> {
        let data = {};
        let temp = {};
        jdx(this.refs.mydisplay).get(temp);
        data = JSON.parse(temp.json);
        jdx(this.refs.myform).set(data);
    };

    render() {
        return (
            <table style={{ border: 1 }} cellSpacing="0">
                <tbody>
                <tr>
                    <td>
                        <form ref="myform">
                            Hidden: <input name="_csrf" type="hidden" value=""/> <br/>
                            Name: <input name="name" type="text" value="" /> <br/>
                            Password: <input name="password" type="password" value="" /> <br/>
                            Sex: <input name="sex" type="radio" value="Male" checked="checked"/>Male
                            <input name="sex" type="radio" value="Female"/>Female <br/>
                            Fruit: <input name="fruit" type="checkbox" value="Apple"/>Apple
                            <input name="fruit" type="checkbox" value="Banana"/>Banana
                            <input name="fruit" type="checkbox" value="Orange"/>Orange <br/>
                            Country: <select name="country">
                            <option value="">--请选择--</option>
                            <option value="中国">中国</option>
                            <option value="美国">美国</option>
                            </select><br/>
                            Sport: <select name="sport" multiple="multiple" >
                            <option value="足球">足球</option>
                            <option value="篮球">篮球</option>
                            <option value="乒乓球">乒乓球</option>
                            </select><br/>
                            Note: <textarea name="note"></textarea><br/>
                            <input type="reset" value="Reset"/> <br/>
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
