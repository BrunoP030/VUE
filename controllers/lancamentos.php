<?php

class Lancamentos extends Controller
{

    function __construct()
    {
        Auth::autentica();
        parent::__construct();
        $this->view->js = array();
        $this->view->css = array();
    }

    function index()
    {
        $this->view->title = "Home";
        array_push($this->view->js, "views/lancamentos/app.vue.js");
        array_push($this->view->css, "views/lancamentos/app.vue.css");
        $this->view->render('header');
        $this->view->render('footer');
    }
    function lancamento()
    {
        $this->model->lancamento();
    }
    function relatorio()
    {
        $this->model->relatorio();
    }
    function getTplanc()
    {
        $this->model->getTplanc();
    }
    function getTpfluxo(){
        $this->model->getTpfluxo();
    }
    function edit(){
        $this->model->edit();
    }
    function del(){
        $this->model->del();
    }
    function get_lvl(){
        $this->model->get_lvl();
    }
}