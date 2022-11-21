import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useSelect, dispatch } from '@wordpress/data';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import './style.scss';
import './editor.scss';
import metadata from './block.json';

import './todos-store';
import './plugins/sidebar';
import './blocks/meta';
import './blocks/todo-list-block';
import './blocks/todo-list-info';
