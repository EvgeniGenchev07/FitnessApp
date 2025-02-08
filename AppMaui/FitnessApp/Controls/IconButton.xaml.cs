/* [grial-metadata] id: Grial#IconButton.xaml version: 1.0.1 */
using System;
using System.Collections.Generic;

namespace FitnessApp
{
    public partial class IconButton : ContentView
    {
        public event EventHandler Clicked;

        public static readonly BindableProperty IconAttributeProperty = BindableProperty.Create(
           nameof(IconAttribute),
           typeof(IconAttribute),
           typeof(IconButton),
           propertyChanged: (b, o, n) => ((IconButton)b).IconAttributeChanged());

        public IconAttribute IconAttribute
        {
            get { return (IconAttribute)GetValue(IconAttributeProperty); }
            set { SetValue(IconAttributeProperty, value); }
        }

        public static readonly BindableProperty IconTextProperty =
            BindableProperty.Create(
                nameof(IconText),
                typeof(string),
                typeof(IconButton),
                defaultValue: null);

        public string IconText
        {
            get { return (string)GetValue(IconTextProperty); }
            set { SetValue(IconTextProperty, value); }
        }

        public static readonly BindableProperty IconColorProperty = BindableProperty.Create(
            nameof(IconColor),
            typeof(Color),
            typeof(IconButton),
            Colors.Black);

        public Color IconColor
        {
            get { return (Color)GetValue(IconColorProperty); }
            set { SetValue(IconColorProperty, value); }
        }

        public static readonly BindableProperty IconFontSizeProperty = BindableProperty.Create(
            nameof(IconFontSize),
            typeof(double),
            typeof(IconButton),
            defaultValue: 11d);

        public double IconFontSize
        {
            get { return (double)GetValue(IconFontSizeProperty); }
            set { SetValue(IconFontSizeProperty, value); }
        }

        public static readonly BindableProperty IconFontFamilyProperty = BindableProperty.Create(
            nameof(IconFontFamily),
            typeof(string),
            typeof(IconButton),
            defaultValue: null);

        public string IconFontFamily
        {
            get { return (string)GetValue(IconFontFamilyProperty); }
            set { SetValue(IconFontFamilyProperty, value); }
        }

        public static readonly BindableProperty TextProperty = BindableProperty.Create(
            nameof(Text),
            typeof(string),
            typeof(IconButton),
            defaultValue: null);

        public string Text
        {
            get { return (string)GetValue(TextProperty); }
            set { SetValue(TextProperty, value); }
        }

        public static readonly BindableProperty ButtonStyleProperty = BindableProperty.Create(
            nameof(ButtonStyle),
            typeof(Style),
            typeof(IconButton),
            defaultValue: null);

        public Style ButtonStyle
        {
            get { return (Style)GetValue(ButtonStyleProperty); }
            set { SetValue(ButtonStyleProperty, value); }
        }

        public static readonly BindableProperty CommandProperty = BindableProperty.Create(
            nameof(Command),
            typeof(Command),
            typeof(IconButton),
            defaultValue: null);

        public Command Command
        {
            get { return (Command)GetValue(CommandProperty); }
            set { SetValue(CommandProperty, value); }
        }

        public static readonly BindableProperty CommandParameterProperty = BindableProperty.Create(
            nameof(CommandParameter),
            typeof(object),
            typeof(IconButton),
            defaultValue: null);

        public object CommandParameter
        {
            get { return (object)GetValue(CommandParameterProperty); }
            set { SetValue(CommandParameterProperty, value); }
        }

        public static readonly BindableProperty BorderColorProperty = BindableProperty.Create(
            nameof(BorderColor),
            typeof(Color),
            typeof(IconButton),
            defaultValue: null,
            propertyChanged: (s, o, n) => ((IconButton)s).button.BorderColor = (Color)n);

        public Color BorderColor
        {
            get { return (Color)GetValue(BorderColorProperty); }
            set { SetValue(BorderColorProperty, value); }
        }

        public static readonly BindableProperty TextColorProperty = BindableProperty.Create(
            nameof(TextColor),
            typeof(Color),
            typeof(IconButton),
            defaultValue: null,
            propertyChanged: (s, o, n) => ((IconButton)s).button.TextColor = (Color)n);

        public Color TextColor
        {
            get { return (Color)GetValue(TextColorProperty); }
            set { SetValue(TextColorProperty, value); }
        }

        public new static readonly BindableProperty BackgroundColorProperty = BindableProperty.Create(
            nameof(BackgroundColor),
            typeof(Color),
            typeof(IconButton),
            defaultValue: null,
            propertyChanged: (s, o, n) => ((IconButton)s).button.BackgroundColor = (Color)n);

        public new Color BackgroundColor
        {
            get { return (Color)GetValue(BackgroundColorProperty); }
            set { SetValue(BackgroundColorProperty, value); }
        }

        public static readonly BindableProperty IconPositionProperty = BindableProperty.Create(
            nameof(IconPosition),
            typeof(IconButtonPosition),
            typeof(IconButton),
            defaultValue: IconButtonPosition.Left,
            propertyChanged: (b, o, n) =>
            {
                if (((IconButton)b).IconPosition == IconButtonPosition.Left)
                {
                    Grid.SetColumn(((IconButton)b).icon, 0);
                    ((IconButton)b).icon.HorizontalOptions = LayoutOptions.End;
                }
                else
                {
                    Grid.SetColumn(((IconButton)b).icon, 2);
                    ((IconButton)b).icon.HorizontalOptions = LayoutOptions.Start;
                }
            });

        public IconButtonPosition IconPosition
        {
            get { return (IconButtonPosition)GetValue(IconPositionProperty); }
            set { SetValue(IconPositionProperty, value); }
        }

        public IconButton()
        {
            InitializeComponent();
        }

        private void IconAttributeChanged()
        {
            if (IconAttribute == IconAttribute.Line)
            {
                icon.SetDynamicResource(StyleProperty, "FontIcon");
            }
            else
            {
                icon.SetDynamicResource(StyleProperty, "FontIconFill");
            }
        }

        private void OnButtonClicked(object sender, EventArgs e)
        {
            Clicked?.Invoke(this, EventArgs.Empty);
        }
    }
}
