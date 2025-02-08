/* [grial-metadata] id: Grial#NewsListPage.cs version: 1.0.1 */
namespace FitnessApp.Views;

public partial class ListPage : ContentPage
{
	public ListPage()
	{
		InitializeComponent();

        BindingContext = new MainViewModel(Navigation);
    }
}
