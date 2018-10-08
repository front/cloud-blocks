# Seven-Fields

### About
For one of my projects that needs some settings, I searched to find a library who does this for me. I found Carbon Fields, its nice and relativaly easy to use and most important, could be installed via composer.

But it has its limitations. Non of the fields types had description (at least when I used it). Also the function for retriving options valie from database, is loading after **init** action, but what if I need to access data before init? Well, I need to write my function. And also field types was a bit limited.

So decided to write my own and after finishing, thought why not to open source it so other can benifit.

### Supported Fields
- Checkbox
- Header
- Raw html
- Multiselect
- Select
- Textfield
- Textarea

More fields will be added later, but til them, don't hesitate to ask for features and more fields by opening new issue.

### How to use?

1- In your plugin or theme directory, run 
`composer require foadyousefi/seven-fields`

2- In your functions.php or your plugin write:
```
use SevenFields\Fields\Fields;
use SevenFields\Container\Container;

add_action( 'admin_menu', 'setting_pages_init' );
function setting_pages_init() {
    Container::make( 'Menu title', 'menu-slug' )
    ->add_fields( 'add_fields_to_the_page' );
}

function add_fields_to_the_page() {
    Fields::add('header', null, 'This is header' );
    Fields::add('text', 'example_text_field', 'This is text field', 'And this is description' );
    Fields::add( 'checkbox', 'example_checkbox', 'Checkbox label', 'And description' );
    Fields::add( 'textarea', 'example_text_area', 'Textarea example',  'And description. <be />New line in description with <b>bold</b> text.' );

  }
```

### How to read options?

To read options from database, you can somply use wordpress [`get_option()`](https://developer.wordpress.org/reference/functions/get_option/) function by passing the optoin name and optional default value. like so:

```
get_option( 'example_text_field', 'lorem ipsum' )
```


I will try to update README and describe all possible options.
