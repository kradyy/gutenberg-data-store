<?php

/**
 * Plugin Name:       Data-store demo
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       boilerplate
 *
 * @package           create-block
 */

include_once 'templates.php';

function create_block_boilerplate_block_init()
{
    register_block_type(__DIR__ . '/build');
}

add_action('init', 'create_block_boilerplate_block_init');

function create_block_boilerplate_register_meta()
{
    register_meta('post', 'testfield', [
        'single' => true,
        'type' => 'string',
        'show_in_rest' => true,
        'sanitize_callback' => 'sanitize_text_field',
        'auth_callback' => function () {
            // For private fields (_), not usable here
            return current_user_can(
                'edit_posts'
            );
        }
    ]);
}

add_action('rest_api_init', 'create_block_boilerplate_register_meta');