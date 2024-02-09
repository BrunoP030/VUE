<?php

class Tipo_Lancamento extends Controller
{

    function __construct()
    {
        Auth::autentica();
        Auth::perm(2);
        parent::__construct();
        $this->view->js = array();
        $this->view->css = array();
    }

    function index()
    {
        $this->view->title = "Home";
        array_push($this->view->js, "views/tipo_lancamento/app.vue.js");
        array_push($this->view->css, "views/tipo_lancamento/app.vue.css");
        $this->view->render('header');
        $this->view->render('footer');
    }
    function insert(){
        $this->model->insert();
    }
    function lista(){
        $this->model->lista();
    }
    function del(){
        $this->model->del();
    }

    function edit(){
        $this->model->edit();
    }

}