<?php

class Cadastro extends Controller
{
    function index()
    {
        $this->view->title = "Home";
        array_push($this->view->js, "views/cadastro/app.vue.js");
        array_push($this->view->css, "views/cadastro/app.vue.css");
        $this->view->render('header');
        $this->view->render('footer');
    }
    function __construct()
    {
        Auth::autentica();
        Auth::perm(1);
        parent::__construct();
        $this->view->js = array();
        $this->view->css = array();
    }
    function cadastro(){
        $this->model->cadastro();
    }
    function getLvl(){
        $this->model->getLvl();
    }
    function lista(){
        $this->model->lista();
    }
    function edit(){
        $this->model->edit();
    }
    function editar(){
        $this->model->editar();
    }
}