<?php

class Lancamentos_Model extends Model
{
    public function __construct()
    {
        parent::__construct();
    }
    public function lancamento(){
        Session::init();
        $x=file_get_contents("php://input");
        $x=json_decode($x);
        $valor=$x->VALOR;
        $obs=$x->OBS;
        $tplan=$x->DROPTIPO;
        $tpfluxo=$x->DROPFLUXO;
        $usuario = $_SESSION['id'];
        $data= date('Y-m-d');
        $result=$this->db->insert("fluxocaixa.lancamento", array('data'=>$data, 'tipo'=>$tplan, 'valor'=>$valor, 'fluxo'=>$tpfluxo, 'obs'=>$obs, 'usuario'=>$usuario));

        if($result){
            $msg=array("codigo"=>1, "texto"=>"Lançamento registrado com sucesso");
        }else{
            $msg=array("codigo"=>0, "texto"=> "Falha no lançamento");
        }
        echo(json_encode($msg));
    }

    public function relatorio()
    {
        Session::init();

        $id = $_SESSION['id'];

        if ($_SESSION['nivel'] != 3) {
            $sql = $this->db->select("
                                              SELECT
                                                  l.sequencia,  
                                                  t.descricao AS tipolanc,
                                                  l.tipo,
                                                    tf.descricao,
                                                    l.fluxo,
                                                    l.valor,
                                                    date_format(l.data, '%d/%m%/%Y') as data,
                                                    l.obs
                                                    FROM
                                                        fluxocaixa.lancamento l
                                                    JOIN fluxocaixa.tipolancamento t ON
                                                        l.tipo = t.sequencia
                                                    JOIN fluxocaixa.tipofluxo tf ON
                                                        tf.codigo = l.fluxo");
        } else {
            $sql = $this->db->select("SELECT
                                            l.sequencia,
                                            l.tipo,
                                            t.descricao AS tplanc,
                                            l.fluxo,
                                            tf.descricao,
                                            l.valor,
                                            date_format(l.data, '%d/%m%/%Y') as data,
                                            l.obs
                                        FROM
                                            fluxocaixa.lancamento l
                                        JOIN fluxocaixa.tipolancamento t ON
                                            l.tipo = t.sequencia
                                        JOIN fluxocaixa.tipofluxo tf ON
                                            tf.codigo = l.fluxo
                                        WHERE
                                            l.usuario = '$id'");
        }
        echo(json_encode($sql));
    }
    public function getTplanc(){
        $result = $this->db->select("select sequencia, descricao as tipolanc 
from fluxocaixa.tipolancamento t ");
        if($result){
            $msg=array("data"=> $result, "codigo"=>1);
        }else{
            $msg=array("codigo"=>0);
        }
        echo json_encode($msg);
    }
    public function getTpfluxo(){
        $result = $this->db->select("select codigo, descricao as descricao
from fluxocaixa.tipofluxo t");
        if($result){
            $msg = array("data"=> $result, "codigo"=>1);
        }else{
            $msg = array("codigo"=>0);
        }
        echo json_encode($msg);
    }

    public function edit(){
        $x = file_get_contents("php://input");
        $x = json_decode($x);

        $seq = $x->SEQUENCIA;
        $valor = $x->VALOR;
        $fluxo = $x->DROPFLUXO;
        $tplanc = $x->DROPTIPO;
        $obs= $x->OBS;

        $dados=array("valor"=>$valor, "tipo"=>$tplanc, "fluxo"=>$fluxo, "obs"=>$obs);

        $result = $this->db->update("fluxocaixa.lancamento", $dados, "sequencia = $seq");

        if($result){
            $msg = array("codigo"=>1, "texto"=>"Registro atualizado com sucesso");
        }else{
            $msg = array("codigo"=>0, "texto"=>"Erro ao atualizar o registro");
        }
        echo json_encode($msg);

    }
    public function del(){
        $x = file_get_contents("php://input");
        $x = json_decode($x);


        $seq = $x;

        $del = $this->db->delete("fluxocaixa.lancamento", "sequencia = $seq");

        if($del){
            $msg = array("codigo"=> 1, "texto"=>"Registro excluido com sucesso");
        }else{
            $msg = array("codigo"=>0, "texto"=>"Erro ao deletar");
        }
        echo json_encode($msg);
    }
    public function get_lvl(){
        $lvl= $_SESSION['nivel'];

        if($lvl){
            $nivel = array("lvl"=>$lvl);
        }else{
            $nivel = array("erro");
        }

        echo json_encode($nivel);
}
}