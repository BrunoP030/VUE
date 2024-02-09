<?php

class Login extends Controller
{

    function __construct()
    {
        @session_start();
        @session_destroy();
        parent::__construct();
        $this->view->js = array();
        $this->view->css = array();
    }

    function index()
    {
        $this->view->title = "Home";
        array_push($this->view->js, "views/login/app.vue.js");
        array_push($this->view->css, "views/login/app.vue.css");
        $this->view->render('header');
        $this->view->render('footer');
    }
    function login(){
        $this->model->login();
    }
}