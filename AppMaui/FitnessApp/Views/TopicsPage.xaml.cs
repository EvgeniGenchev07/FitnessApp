/* [grial-metadata] id: Grial#NewsTopicsPage.cs version: 1.0.1 */
namespace FitnessApp.Views;

public partial class TopicsPage : ContentPage
{
	public TopicsPage()
	{
		InitializeComponent();

        BindingContext = new TopicsViewModel();
    }
}
