<?php
/**
 * 
 */
class Auth
{

    public static function autentica()
    {
        @session_start();

        $logado = $_SESSION['logado'];

        if ($logado) {
        } else if ($logado != true) {
            session_destroy();
            header('Location: ' . URL . 'login/');
            return;
        }
    }

    public static function perm($lvl)
    {
        @session_start();
        $nivel = $_SESSION['nivel'];

        if ($nivel > $lvl) {

            session_destroy();
            header('Location: ' . URL . 'index/');
            return;
        }
    }
    public static function logout()
    {
        session_start();
        session_destroy();
    }
}
