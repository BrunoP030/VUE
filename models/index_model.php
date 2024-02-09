
<?php

require_once("util/param.php");

class Index_Model extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function lista()
    {
        $result = $this->db->select("select * from test.n");

        if ($result) {
            exit (json_encode(array("code" => 1, "msg" => 'Success', "data" => $result)));
        } else {
            exit (json_encode(array("code" => 0, "msg" => 'Falha')));
        }
    }
}