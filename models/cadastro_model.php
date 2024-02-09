<?php

class Cadastro_Model extends Model{
    public function __construct(){
        parent::__construct();
    }

    public function cadastro(){
        $x = file_get_contents("php://input");
        $x=json_decode($x);
        $nome=$x->txtnome;
        $id=$x->txtusuario;
        $senha=$x->senha;
        $lvl=$x->nivel;
        $cripto = hash('sha256', $senha);

        $result=$this->db->insert("fluxocaixa.usuario", array('id'=>$id, 'nome'=>$nome, 'senha'=>$cripto, 'nivel'=>$lvl));

        if($result){
            $msg=array("codigo"=>1,"texto"=>"Registro inserido com sucesso");
        }
        else{
            $msg=array("codigo"=>0,"texto"=>"Erro ao registrar");
        }
        echo(json_encode($msg));
    }
    public function getLvl(){

        $result=$this->db->select("select codigo,concat(codigo, ' - ', descricao) as nivel
        from fluxocaixa.nivelusuario n");

        if($result){
            $msg=array("codigo"=>1, "texto"=>"FOi", "data" => $result);
        }else{
            $msg=array("codigo"=>0, "texto"=>"erro");
        }
        echo(json_encode($msg));
    }
    public function lista(){

        $result = $this->db->select("select u.id, u.nome, u.nivel 
from fluxocaixa.usuario u");
        if($result){
            $sql = array("data"=>$result, "codigo"=>1);

        }else{
            $sql = array("codigo"=>0);
        }
        echo json_encode($sql);
        }
    public function edit(){
        $x = file_get_contents("php://input");
        $x = json_decode($x);
        $result = $this->db->select("select nivel
from fluxocaixa.usuario u");
        if($result){
            $msg = array("data"=>$result);
        }else{
            $msg = array("codigo"=>0);
        }
        echo json_encode($msg);
    }
    public function editar(){
        $x = file_get_contents("php://input");
        $x = json_decode($x);

        $nome=$x->txtnome;
        $id=$x->txtusuario;
        $lvl=$x->nivel;

        $dados=array("nivel"=>$lvl);

        $result = $this->db->update("fluxocaixa.usuario", $dados, "id = '$id'");

        if($result){
            $msg = array("codigo"=>1, "texto"=>"Registro atualizado com sucesso");
        }else{
            $msg = array("codigo"=>0, "texto"=>"Erro ao atualizar o registro");
        }
        echo json_encode($msg);
    }
}