import React, { useState, useEffect, forwardRef } from "react";
import { Link, BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import GroupWorkOutlinedIcon from '@material-ui/icons/GroupWorkOutlined';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import MaterialTable from "material-table";
import Alert from "@material-ui/lab/Alert";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

import axios from "axios";
import { logout } from "./actions/auth";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.scss";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const api = axios.create({
  baseURL: "https://reqres.in/api/",
});

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(String(email).toLowerCase());
}

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

function App() {
  var columns = [
    { title: "id", field: "id", hidden: true },
    { title: "Avatar",
      render: (rowData) => (
        <img
          width={40}
          src={rowData === undefined ? " " : rowData.avatar}
          alt=""
        />
      ),
    },
    { title: "First name", field: "first_name" },
    { title: "Last name", field: "last_name" },
    { title: "Email", field: "email" },
  ];

  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const { user: currentUser } = useSelector(state => state.auth);

  const logOut = () => {
    dispatch(logout());
  };

  useEffect(() => {
    api
      .get("/users")
      .then(res => {
        setData(res.data.data);
      })
      .catch(error => {
        console.log("Error" + error);
      });
  }, []);

  const handleRowUpdate = (newData, oldData, resolve) => {
    let errorList = [];

    if (!newData.first_name) {
      errorList.push("Please enter first name");
    }
    if (!newData.last_name) {
      errorList.push("Please enter last name");
    }
    if (!newData.email || !validateEmail(newData.email)) {
      errorList.push("Please enter a valid email");
    }

    if (errorList.length < 1) {
      api
        .patch("/users/" + newData.id, newData)
        .then(res => {
          const dataUpdate = [...data];
          const index = oldData.tableData.id;
          dataUpdate[index] = newData;
          setData([...dataUpdate]);
          setIserror(false);
          setErrorMessages([]);
          resolve();
        })
        .catch(error => {
          setErrorMessages(["Update failed! " + error]);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve();
    }
  };

  const handleRowAdd = (newData, resolve) => {
    let errorList = [];
  
    if (newData.first_name === undefined) {
      errorList.push("Please enter first name");
    }
    if (newData.last_name === undefined) {
      errorList.push("Please enter last name");
    }
    if (newData.email === undefined || validateEmail(newData.email) === false) {
      errorList.push("Please enter a valid email");
    }

    if (errorList.length < 1) {
      api
        .post("/users", newData)
        .then(res => {
          let dataToAdd = [...data];
          dataToAdd.push(newData);
          setData(dataToAdd);
          resolve();
          setErrorMessages([]);
          setIserror(false);
        })
        .catch(error => {
          setErrorMessages(["Cannot add data." + error]);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve();
    }
  };

  const handleRowDelete = (oldData, resolve) => {
    api
      .delete("/users/" + oldData.id)
      .then(res => {
        const dataDelete = [...data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve();
      })
      .catch(error => {
        setErrorMessages(["Delete failed!" + error]);
        setIserror(true);
        resolve();
      });
  };

  return (
    <Router history={history}>
      <div className="app">
      {currentUser && 
        <>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <div className="flex home">
              <GroupWorkOutlinedIcon className={classes.icon} />
              <Typography variant="h6" color="inherit" noWrap>
                Dashboard
              </Typography>
            </div>
            <Link to="/logout" color="inherit" onClick={logOut}>
              Logout
            </Link>
          </Toolbar>
        </AppBar>
        </>
      }
      <main>
        {currentUser &&
            <Grid container spacing={1}>
              <Grid item xs={3}></Grid>
              <Grid item xs={6}>
                <div>
                  {iserror && (
                    <Alert severity="error">
                      {errorMessages.map((msg, i) => {
                        return <div key={i}>{msg}</div>;
                      })}
                    </Alert>
                  )}
                </div>
                <MaterialTable
                  title=""
                  columns={columns}
                  data={data}
                  icons={tableIcons}
                  editable={{
                    onRowUpdate: (newData, oldData) =>
                      new Promise(resolve => {
                        handleRowUpdate(newData, oldData, resolve);
                      }),
                    onRowAdd: (newData) =>
                      new Promise(resolve => {
                        handleRowAdd(newData, resolve);
                      }),
                    onRowDelete: (oldData) =>
                      new Promise(resolve => {
                        handleRowDelete(oldData, resolve);
                      }),
                  }}
                />
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>
        }
        <div>
          <Switch>
            <Route exact path={["/","/login"]} component={Login} />
            {!currentUser &&
              <Route exact path="/register" component={Register} />
            }
          </Switch>
        </div>
      </main>
      <footer className={classes.footer}>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Copyright &copy; <a href="http://girlsincode.com/" target="_blank" rel="noopener noreferrer">girlsincode</a>
        </Typography>
      </footer>
      </div>
    </Router>
  );
}

export default App;
