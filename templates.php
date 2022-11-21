<?php

function data_store_plugin_register()
{
    $post_type_object = get_post_type_object('page');

    $post_type_object->template = array(
        array(
            'create-block/todo-list-meta'
        )
        );
}

add_action('init', 'data_store_plugin_register');