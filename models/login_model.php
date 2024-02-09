<?php

require_once("util/param.php");

class Login_Model extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function login() {
        $x = file_get_contents("php://input");
        $x=json_decode($x);
        $usuario = $x->txtusario;
        $senha = $x->senha;
        
        $cripto = hash('sha256', $senha);

        $dados = array(":usuario" => $usuario, ":senha" => $cripto);

        $result= $this->db->select("select u.id, u. senha, u.nome, u.nivel
        from fluxocaixa.usuario u, fluxocaixa.nivelusuario n 
        where u.nivel = n.codigo and u.id = :usuario and senha = :senha", $dados ); 



        $count = count($result);

        if($count > 0){
            Session::init();
            Session::set('nome',$result[0]->nome);
            Session::set('id', $result[0]->id);
            Session::set('senha', $result[0]->senha);
            Session::set('nivel', $result[0]->nivel);
            Session::set('logado', true);
        } else{
            $erro = "dados incorretos";
        }


        if ($result){
            $msg=array("codigo"=>1, "texto"=> "Login efetuado com sucesso");
        }
        else{
            $msg= array("codigo"=>0, "texto"=>"Falha no login, usario ou senha incorretos");
        }
        echo(json_encode($msg));
    }
}
