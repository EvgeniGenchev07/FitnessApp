/* [grial-metadata] id: Grial#NewsSourcesPage.cs version: 1.0.1 */
namespace FitnessApp.Views;

public partial class SourcesPage : ContentPage
{
	public SourcesPage()
	{
		InitializeComponent();

        BindingContext = new SourcesViewModel(Navigation);
    }
}
