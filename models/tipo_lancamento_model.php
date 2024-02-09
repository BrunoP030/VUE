<?php

class Tipo_Lancamento_Model extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function insert()
    {
        $x = file_get_contents("php://input");
        $x = json_decode($x);
        $desc = $x->DESCRICAO;

        $result = $this->db->insert("fluxocaixa.tipolancamento", array('descricao' => $desc));

        if ($result) {
            $msg = array("codigo" => 1, "texto" => "Registro inserido com sucesso");
        } else {
            $msg = array("codigo" => 0, "texto" => "Erro no registro");
        }
        echo json_encode($msg);
    }

    public function lista()
    {
        $result = $this->db->select("select *
from fluxocaixa.tipolancamento t");

        if ($result) {
            $msg = array("data" => $result, "codigo" => 1);
        } else {
            $msg = array("codigo" => 0);
        }
        echo json_encode($msg);
    }

    public function del()
    {
        $x = file_get_contents("php://input");
        $x = json_decode($x);
        $seq = $x;

        $del = $this->db->delete("fluxocaixa.tipolancamento", "sequencia = $seq");

        if($del){
            $msg = array("codigo"=> 1, "texto"=>"Registro excluido com sucesso");
        }else{
            $msg = array("codigo"=>0, "texto"=>"Erro ao deletar");
        }
        echo json_encode($msg);
    }

    public function edit(){
        $x = file_get_contents("php://input");
        $x = json_decode($x);



        $seq = $x->SEQUENCIA;
        $desc = $x->DESCRICAO;

        $dados = [
            'descricao' => $desc
        ];


        $result = $this->db->update("fluxocaixa.tipolancamento", $dados,  "sequencia= $seq");

        if($result){
            $msg = array("codigo" => 1, "texto" => "Registro atualizado com sucesso!");
        }else{
            $msg = array("codigo" => 0, "texto" => "Erro ao atualizar");
        }
        echo json_encode($msg);
    }
}